const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const { Readable } = require('stream')
require('dotenv').config()

const app = express()
const port = 3000
const uri = 'mongodb://localhost:27017'
const dbName = 'aroma'




cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})
app.use(cors())
app.use(express.json())

const storage = multer.memoryStorage()
const upload = multer({ storage })  // ← 這一行要加上

// 登入 API 只給 login 用的 json middleware
app.post('/api/login', express.json(), async (req, res) => {
  const { email, password } = req.body
  const client = new MongoClient(uri)

  try {
    console.log('登入請求收到:', email, password)
    await client.connect()
    const db = client.db(dbName)
    const user = await db.collection('users').findOne({ email })

    console.log('找到使用者:', user)

    if (!user || user.password !== password) {
      return res.status(401).json({ message: '帳號或密碼錯誤' })
    }

    res.json({
      message: '登入成功',
      token: 'fake-jwt-token',           // 可改為 JWT 實作
      manager: user.manager === true,     // 是否為管理員
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        registered: user.registered
      }
    })
  } catch (err) {
    console.error('❌ 登入發生錯誤:', err)
    res.status(500).json({ message: '伺服器錯誤', error: err.message })
  } finally {
    await client.close()
  }
})

// 註冊 API
app.post('/api/register', express.json(), async (req, res) => {
  const { name, email, password } = req.body
  const client = new MongoClient(uri)
 const db = client.db(dbName)
  const cartsCollection = db.collection('carts')
  try {
    await client.connect()
   
    const existingUser = await db.collection('users').findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: '此 Email 已被註冊' })
    }

    // ✅ 產生唯一的自訂 id
    const count = await db.collection('users').countDocuments()

    
    // const timestamp = Date.now()
    // const id = `user_${String(count + 1).padStart(4, '0')}_${timestamp}`
    const id = count + 1 // 簡化版，實務上應用更複雜的 ID 生成邏輯

    // 建立新使用者
    const newUser = {
      id, // 加入自訂 id
      name,
      email,
      password, // 注意：實務上應加密！此範例為簡化
      registered: new Date(),
      manager: false
    }

    const result = await db.collection('users').insertOne(newUser)

     // ✅ 建立對應購物車

    await cartsCollection.insertOne({
      user_id: newUser.id,  // 數字 ID
      items: [],
      updated_at: new Date()
    })

    res.json({
      message: '註冊成功',
      token: 'fake-jwt-token',  // 可改 JWT
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        registered: newUser.registered
      }
    })
  } catch (err) {
    console.error('❌ 註冊錯誤:', err)
    res.status(500).json({ message: '伺服器錯誤', error: err.message })
  } finally {
    await client.close()
  }
})

// 修改密碼
app.post('/api/reset-password', express.json(), async (req, res) => {
  const { email, newPassword } = req.body

  // 假設你用 Bearer token 取得使用者 email 或 id
  // 這邊因為你前端只是用 fake-jwt-token，示範用 email 從 body 取得比較簡單
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: '未授權' })
  }

  if (!email) {
    return res.status(400).json({ message: '缺少 email' })
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(dbName)

    const user = await db.collection('users').findOne({ email })
    if (!user) {
      return res.status(404).json({ message: '使用者不存在' })
    }

    // 更新密碼（實務中要 hash）
    await db.collection('users').updateOne(
      { email },
      { $set: { password: newPassword } }
    )

    res.json({ message: '密碼更新成功' })
  } catch (err) {
    console.error('重設密碼錯誤:', err)
    res.status(500).json({ message: '伺服器錯誤', error: err.message })
  } finally {
    await client.close()
  }
})

// 取得所有商品 API
app.get('/api/products', async (req, res) => {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(dbName)
    const products = await db.collection('products').find().toArray()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message })
  } finally {
    await client.close()
  }
})

// 取得一般會員（非管理員）資料 + 真實 orders
app.get('/api/users', async (req, res) => {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(dbName)
    const users = await db.collection('users')
      .find({ manager: false }, { projection: { password: 0 } })
      .toArray()

    const orders = await db.collection('orders').find().toArray()

    // 依 user.id 對應 orders
    const userMap = users.map(user => {
      const userOrders = orders
        .filter(order => order.user_id === user.id)
        .map(order => ({
          id: order.order_id,
          amount: `$${order.amount}`,
          status: order.status
        }))
      return { ...user, orders: userOrders }
    })

    res.json(userMap)
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message })
  } finally {
    await client.close()
  }
})


// ✅ 上傳商品 API（包含圖片存 Cloudinary）
app.post('/api/products', upload.single('image'), async (req, res) => {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(dbName)
    const { name, category, price, stock } = req.body

    // 自動產生 product_id
    if (!req.file) {
      return res.status(400).json({ message: '未收到圖片檔案' })
    }

    const count = await db.collection('products').countDocuments()
    const timestamp = Date.now()
    const product_id = `product_${String(count + 1).padStart(4, '0')}_${timestamp}`

    // 上傳圖片到 Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {git
        const stream = cloudinary.uploader.upload_stream(
          {
            public_id: `products/${product_id}`, // ✅ 每次都唯一
          },
          (error, result) => {
            if (result) resolve(result)
            else reject(error)
          }
        )
        Readable.from(buffer).pipe(stream)
      })
    }


    const result = await streamUpload(req.file.buffer)
    const image = result.secure_url

    // 儲存商品到 MongoDB
    const product = {
      product_id,
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      image
    }

    await db.collection('products').insertOne(product)
    res.json({ message: '商品已成功上架' })
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤1040729', error: err.message })
  } finally {
    await client.close()
  }
})

// 取得特定產品0730
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params
  try {
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(dbName)
    const product = await db.collection('products').findOne({ product_id: id })
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
    } else {
      res.json(product)
    }
    await client.close()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// 加入商品至購物車0730
app.post('/api/cart', async (req, res) => {
  const { user_id, product_id, quantity } = req.body
const client = new MongoClient(uri)
await client.connect()
const db = client.db(dbName)
const cartCollection = db.collection('carts') // ✅ 新增這三行


  if (!user_id || !product_id || quantity === undefined) {
    return res.status(400).json({ error: '缺少必要欄位' })
  }

  try {
    const existingCart = await cartCollection.findOne({ user_id })

    if (existingCart) {
      const itemIndex = existingCart.items.findIndex(item => item.product_id === product_id)

      if (itemIndex !== -1) { //itemIndex !== -1代表已存在
        // 已存在，更新數量
        if (quantity === 0) {
          existingCart.items.splice(itemIndex, 1) // ❌ 數量 0 移除
        } else {
          existingCart.items[itemIndex].quantity = quantity
        }
      } else if (quantity > 0) {
        existingCart.items.push({ product_id, quantity })
      }

      await cartCollection.updateOne(
        { user_id },
        {
          $set: {
            items: existingCart.items,
            updated_at: new Date()
          }
        }
      )
    } else {
      // 購物車不存在，新增一筆
      await cartCollection.insertOne({
        user_id,
        items: [{ product_id, quantity }],
        updated_at: new Date()
      })
    }

    res.json({ message: '購物車更新成功' })
  } catch (error) {
    console.error('寫入購物車失敗:', error)
    res.status(500).json({ error: '伺服器錯誤' })
  }finally {
  await client.close() // ✅ 加這行
}
})

// 登入後載入購物車0730
app.get('/api/cart', async (req, res) => {
  const user_id = parseInt(req.query.user_id)
  console.log('載入購物車請求收到，user_id:', user_id)

  if (!user_id) {
    return res.status(400).json({ error: '缺少 user_id' })
  }
  const client = new MongoClient(uri)            // ✅ 加在這裡
  await client.connect()
  const db = client.db(dbName)
  const cartCollection = db.collection('carts')  // ✅ 這一行就是 cartCollection 的定義

  try {
    const cart = await cartCollection.findOne({ user_id })
    if (cart) {
      res.json(cart)
    } else {
      res.json({ user_id, items: [] }) // 回傳空購物車
    }
  } catch (error) {
    console.error('讀取購物車失敗:', error)
    res.status(500).json({ error: '伺服器錯誤' })
  }
})

// 建立訂單 API
app.post('/api/orders', async (req, res) => {
  const { user_id, name, address, phone, note, items } = req.body
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(dbName)

    const parsedUserId = typeof user_id === 'string' ? parseInt(user_id) : user_id

    // 1. 查詢所有商品價格
    const productIds = items.map(i => i.product_id)
    const products = await db.collection('products')
      .find({ product_id: { $in: productIds } })
      .toArray()

    const productMap = {}
    products.forEach(p => {
      productMap[p.product_id] = p
    })

    // 2. 計算總金額與建立 order_items
    let amount = 0
    const order_items = items.map(i => {
      const product = productMap[i.product_id]
      const price = product?.price || 0
      const subtotal = price * i.quantity
      amount += subtotal

      return {
        product_id: i.product_id,
        name: product?.name || '未知商品',
        price,
        quantity: i.quantity,
        subtotal
      }
    })

    // 3. 產生 order_id
    const lastOrder = await db.collection('orders')
      .find()
      .sort({ created_at: -1 })
      .limit(1)
      .toArray()

    let orderNumber = 1
    if (lastOrder.length > 0 && lastOrder[0].order_id) {
      const match = lastOrder[0].order_id.match(/order_(\d+)/)
      if (match) {
        orderNumber = parseInt(match[1]) + 1
      }
    }
    const order_id = `order_${String(orderNumber).padStart(4, '0')}`

    // 4. 寫入 orders
    const order = {
      order_id,
      user_id: parsedUserId,
      name,
      address,
      phone,
      note,
      amount,
      status: '處理中',  
      created_at: new Date()
    }
    await db.collection('orders').insertOne(order)

    // 5. 寫入 order_items
    const itemsToInsert = order_items.map(item => ({
  order_id,
  product_id: item.product_id,
  quantity: item.quantity,
  price: item.price
}))
    await db.collection('order_items').insertMany(itemsToInsert)

    // 6. 清空購物車
    await db.collection('carts').updateOne(
      { user_id: parsedUserId },
      { $set: { items: [], updated_at: new Date() } }
    )

    res.json({ message: '訂單建立成功', order_id,amount })

  } catch (err) {
    console.error('❌ 建立訂單失敗:', err)
    res.status(500).json({ error: '伺服器錯誤' })
  } finally {
    await client.close()
  }
})

// 取得特定會員的購買紀錄
app.get('/api/orders/:user_id', async (req, res) => {
  const user_id = parseInt(req.params.user_id)
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(dbName)

    // 找到該會員的所有訂單
    const orders = await db.collection('orders')
      .find({ user_id })
      .sort({ created_at: -1 })
      .toArray()

    // 找到所有這些訂單的明細
    const orderIds = orders.map(o => o.order_id)
    const orderItems = await db.collection('order_items')
      .find({ order_id: { $in: orderIds } })
      .toArray()

    // 把 order_items 塞回 orders
    const ordersWithItems = orders.map(order => ({
      ...order,
      items: orderItems.filter(item => item.order_id === order.order_id)
    }))

    res.json(ordersWithItems)
  } catch (err) {
    console.error('❌ 取得購買紀錄失敗:', err)
    res.status(500).json({ error: '伺服器錯誤' })
  } finally {
    await client.close()
  }
})

// 綠界提供的 SDK
const ecpay_payment = require('ecpay_aio_nodejs');

const { MERCHANTID, HASHKEY, HASHIV, HOST } = process.env;

// SDK 提供的範例，初始化
// https://github.com/ECPay/ECPayAIO_Node.js/blob/master/ECPAY_Payment_node_js/conf/config-example.js
const options = {
  OperationMode: 'Test', //Test or Production
  MercProfile: {
    MerchantID: MERCHANTID,
    HashKey: HASHKEY,
    HashIV: HASHIV,
  },
  IgnorePayment: [
    //    "Credit",
    //    "WebATM",
    //    "ATM",
    //    "CVS",
    //    "BARCODE",
    //    "AndroidPay"
  ],
  IsProjectContractor: false,
};
let TradeNo;


// ✅ Vue 前端會發出這個請求

app.post('/api/ecpay-pay', async (req, res) => {
  console.log('🚀 Received pay request (測試寫死)')
  // SDK 提供的範例，參數設定
  // https://github.com/ECPay/ECPayAIO_Node.js/blob/master/ECPAY_Payment_node_js/conf/config-example.js
    const { amount } = req.body
  if (!amount) {
    return res.status(400).json({ message: '缺少金額 amount' })
  }
  console.log('🚀 金額 amount:', amount)
 

  const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
  TradeNo = 'test' + new Date().getTime();
  let base_param = {
    MerchantTradeNo: TradeNo, //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
    MerchantTradeDate,
    TotalAmount: String(amount),
    TradeDesc: '聯成專案1140813測試交易',
    ItemName: '聯成專案1140813測試商品',
    ReturnURL: `${HOST}/return`,
    ClientBackURL: `${HOST}/clientReturn`,
  };
  const create = new ecpay_payment(options);

  // 注意：在此事直接提供 html + js 直接觸發的範例，直接從前端觸發付款行為
  const html = create.payment_client.aio_check_out_all(base_param);
  console.log(html);

  res.send(html)
  // res.render('index', {
  //   title: 'Express',
  //   html,
  // });
});

//後端接收綠界回傳的資料
app.post('/return', async (req, res) => {
  console.log('req.body:', req.body);

  const { CheckMacValue } = req.body;
  const data = { ...req.body };
  delete data.CheckMacValue; // 此段不驗證

  const create = new ecpay_payment(options);
  const checkValue = create.payment_client.helper.gen_chk_mac_value(data);

  console.log(
    '確認交易正確性：',
    CheckMacValue === checkValue,
    CheckMacValue,
    checkValue,
  );

 // 交易成功後，需要回傳 1|OK 給綠界
  res.send('1|OK');
});

//用戶交易完成後的轉址
app.get('/clientReturn', (req, res) => {
  console.log('clientReturn:', req.body, req.query);
  res.render('return', { query: req.query });
});


app.listen(port, () => {
  console.log(`✅ API Server running on http://localhost:${port}`)
})
