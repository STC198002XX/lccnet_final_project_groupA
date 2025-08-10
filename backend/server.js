const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const { Readable } = require('stream')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000 //上雲則port不能寫死為3000
const uri = process.env.MONGO_URI
const dbName = 'aroma'

// ⚠️ 開發階段：允許本機前端（如 Vite、Vue CLI）來上前端上Heroku要改  const whitelist = ['https://你的前端網域.herokuapp.com']
const whitelist = [
  'http://localhost:5173',  // Vite 預設 port
  'http://localhost:8080',  // Vue CLI 預設 port
  'https://frontend1140813groupa-42a3fe6acaab.herokuapp.com', // Heroku 前端網址
]

const corsOptions = {
  origin(origin, callback) {
    // 沒有 origin（如 Postman）也允許
    if (!origin || whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('不被允許的 CORS 來源：' + origin))
    }
  },
  credentials: true // 若前端 axios 有 withCredentials，要開啟
}



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})
app.use(cors(corsOptions)) // 允許跨域
app.use(express.json())
app.use(express.urlencoded({ extended: true }))  // ⬅️ 加這行

const storage = multer.memoryStorage()
const upload = multer({ storage })  // ← 這一行要加上

// ===== ★★★ 單例 MongoClient + 連線池 ★★★
const client = new MongoClient(uri, {
  maxPoolSize: 15,              // 依流量調整 10~30
  minPoolSize: 0,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})

async function initDb() {
  await client.connect()
  app.locals.db = client.db(dbName)
  console.log('✅ Mongo connected. Pool ready.')
}
initDb().then(() => {
    app.listen(port, () => {
       console.log(`✅ API Server running on http://localhost:${port}`)
    })
   }).catch(err => {
  console.error('❌ Mongo connect failed:', err)
  process.exit(1)
})

// 優雅關閉（Heroku/Docker）
async function shutdown() {
  try { await client.close(); console.log('🛑 Mongo closed.') }
  finally { process.exit(0) }
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

// 登入 API 只給 login 用的 json middleware
app.post('/api/login', express.json(), async (req, res) => {
  const { email, password } = req.body
  const db = req.app.locals.db // 從 app.locals 取得 db 實例

  try {
    console.log('登入請求收到:', email, password)
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
  } 
})

// 註冊 API
app.post('/api/register', express.json(), async (req, res) => {
  const { name, email, password } = req.body
  const db = req.app.locals.db
  const cartsCollection = db.collection('carts')
  try {
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

 const db = req.app.locals.db

  try {

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
  } 
})

// 取得所有商品 API
app.get('/api/products', async (req, res) => {
  const db = req.app.locals.db
  try {
    const products = await db.collection('products').find().toArray()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message })
  } 
})

// 取得一般會員（非管理員）資料 + 真實 orders
app.get('/api/users', async (req, res) => {
  const db = req.app.locals.db
  try {
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
  } 
})


// ✅ 上傳商品 API（包含圖片存 Cloudinary）
app.post('/api/products', upload.single('image'), async (req, res) => {
  const db = req.app.locals.db
  try {
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
      return new Promise((resolve, reject) => {
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
    console.error(err)
    res.status(500).json({ message: '伺服器錯誤1040729', error: err.message })
  } 
})

// 取得特定產品0730
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params
  try {
    const db = req.app.locals.db
    const product = await db.collection('products').findOne({ product_id: id })
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
    } else {
      res.json(product)
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// 加入商品至購物車0730
app.post('/api/cart', async (req, res) => {
  const { user_id, product_id, quantity } = req.body
const db = req.app.locals.db
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
  }
})

// 登入後載入購物車0730
app.get('/api/cart', async (req, res) => {
  const user_id = parseInt(req.query.user_id)
  console.log('載入購物車請求收到，user_id:', user_id)

  if (!user_id) {
    return res.status(400).json({ error: '缺少 user_id' })
  }
  const db = req.app.locals.db
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

// POST /api/cart/add  —— 用「加多少」的語意
app.post('/api/cart/add', express.json(), async (req, res) => {
  const { user_id, product_id, add_quantity } = req.body
  const db = req.app.locals.db
  const products = db.collection('products')
  const carts = db.collection('carts')

  if (user_id === undefined || !product_id || typeof add_quantity !== 'number') {
    return res.status(400).json({ error: '缺少必要欄位' })
  }
  if (add_quantity <= 0) {
    return res.status(400).json({ error: 'add_quantity 必須為正數' })
  }

  try {
    // 1) 查商品庫存
    const prod = await products.findOne({ product_id })
    if (!prod) return res.status(404).json({ error: '商品不存在' })

    const stock = Number(prod.stock ?? 0)

    // 2) 查購物車現有數量
    const cart = await carts.findOne({ user_id: Number(user_id) })
    const currentInCart =
      cart?.items?.find(it => it.product_id === product_id)?.quantity ?? 0

    const newTotal = currentInCart + add_quantity

    // 3) 檢查是否超過庫存
    if (newTotal > stock) {
      const availableToAdd = Math.max(stock - currentInCart, 0)
      return res.status(409).json({
        error: 'INSUFFICIENT_STOCK',
        stock,
        currentInCart,
        availableToAdd,
      })
    }

    // 4) 寫回購物車（設為 newTotal）
    if (cart) {
      const idx = cart.items.findIndex(it => it.product_id === product_id)
      if (idx >= 0) {
        cart.items[idx].quantity = newTotal
      } else {
        cart.items.push({ product_id, quantity: newTotal })
      }
      await carts.updateOne(
        { user_id: Number(user_id) },
        { $set: { items: cart.items, updated_at: new Date() } }
      )
    } else {
      await carts.insertOne({
        user_id: Number(user_id),
        items: [{ product_id, quantity: newTotal }],
        updated_at: new Date(),
      })
    }

    res.json({ message: '購物車更新成功', quantity: newTotal })
  } catch (err) {
    console.error('寫入購物車失敗:', err)
    res.status(500).json({ error: '伺服器錯誤' })
  }
})

// 建立訂單 API（含庫存檢查與扣減）
app.post('/api/orders', async (req, res) => {                 // 定義 POST /api/orders 路由（非同步處理）
  const { user_id, name, address, phone, note, items } = req.body // 從請求本文取出必需欄位（含購物明細 items）
  const db = req.app.locals.db                                  // 取得已連線的資料庫實例
  const client = req.app.locals.client                          // 取得 MongoClient 實例（用來開啟 session）
  const session = client.startSession()                         // 開一個資料庫工作階段（用於交易）

  try {
    const parsedUserId = typeof user_id === 'string' ? parseInt(user_id) : user_id // 將字串 user_id 轉成數字，否則保留
    await session.withTransaction(async () => {                 // 在交易中執行以下所有操作（要嘛全成功，要嘛全回滾）
      const productIds = items.map(i => i.product_id)           // 從訂單項目取出所有 product_id（一次查詢）

      // 1) 查商品

      const products = await db.collection('products')          // 進入 products 集合
        .find({ product_id: { $in: productIds } }, { session }) // 找到訂單中所有商品（在交易 session 下）
        .toArray()                                              // 轉成陣列
      const pmap = Object.fromEntries(products.map(p => [p.product_id, p])) // 以 product_id 建索引（查找 O(1)）



      // 2) 檢查庫存

      const shortages = []                                      // 用來收集不足或不存在的商品
      for (const it of items) {                                 // 逐一檢查每個訂單項目
        const p = pmap[it.product_id]                           // 找到對應商品資料
        const stock = Number(p?.stock ?? 0)                     // 取出庫存（缺省視為 0）
        if (!p) shortages.push({ product_id: it.product_id, reason: 'NOT_FOUND' }) // 商品不存在
        else if (it.quantity > stock)                           // 訂購量 > 庫存 → 不足
          shortages.push({ product_id: it.product_id, stock, requested: it.quantity })
      }

      if (shortages.length) {                                   // 只要有任何不足/不存在
        const e = new Error('INSUFFICIENT_STOCK')               // 丟出自訂錯誤
        e.code = 'INSUFFICIENT_STOCK'                           // 標記錯誤碼（給外層捕捉判斷 409）
        e.data = { shortages }                                  // 帶上不足明細
        throw e                                                 // 中斷交易（將觸發回滾）
      }



      // 3) 先扣庫存（條件式扣減，避免競態）

      const bulkOps = items.map(it => ({                        // 準備多筆更新操作
        updateOne: {
          filter: { product_id: it.product_id, stock: { $gte: it.quantity } }, // 僅當現庫存 ≥ 訂購量才更新
          update: { $inc: { stock: -it.quantity } }             // 庫存遞減訂購量
        }
      }))

      const bulkRes = await db.collection('products').bulkWrite( // 一次送出批次更新
        bulkOps, { ordered: true, session }                      // ordered:true 順序執行；帶入 session
      )

      // 確認每個商品都有成功扣到
      if (bulkRes.modifiedCount !== items.length) {              // 若成功修改數量不等於訂單件數 → 有商品沒扣到
        const e = new Error('INSUFFICIENT_STOCK_AFTER_CHECK')    // 二次防呆（並發下可能被別人先扣走）
        e.code = 'INSUFFICIENT_STOCK'
        throw e                                                  // 丟錯讓交易回滾
      }



      // 4) 計算金額 & 產生 order_id

      let amount = 0                                            // 累計總金額
      const order_items = items.map(i => {                      // 轉換成要寫入的 order_items
        const p = pmap[i.product_id]                            // 取商品資料
        const price = Number(p.price || 0)                      // 價格（缺省 0）
        const subtotal = price * i.quantity                     // 小計
        amount += subtotal                                      // 加總
        return { product_id: i.product_id, quantity: i.quantity, price } // 簡化後的項目
      })



      const last = await db.collection('orders')                // 取上一張訂單（為了編號遞增）
        .find({}, { session }).sort({ created_at: -1 }).limit(1).toArray()

      const lastNo = last[0]?.order_id?.match(/order(\d+)/)?.[1] // 從 order_id 取數字序號
      const orderNumber = lastNo ? parseInt(lastNo) + 1 : 1     // 下一個流水號
      const order_id = `order${String(orderNumber).padStart(4, '0')}` // 產生像 order0001 的格式

      // 5) 寫入 orders / order_items
      await db.collection('orders').insertOne({                 // 寫入訂單主檔
        order_id, user_id: parsedUserId, name, address, phone, note,
        amount, status: '處理中', created_at: new Date()
      }, { session })



      await db.collection('order_items').insertMany(            // 批次寫入訂單明細
        order_items.map(oi => ({ order_id, ...oi })), { session }
      )



      // 6) 清空購物車
      await db.collection('carts').updateOne(                   // 把此使用者購物車清空
        { user_id: parsedUserId },
        { $set: { items: [], updated_at: new Date() } },
        { session }
      )



      res.json({ message: '訂單建立成功', order_id, amount })  // 回傳訂單建立結果（在交易內回應）
    })
  } catch (err) {                                               // 捕捉交易或其他錯誤
    if (err.code === 'INSUFFICIENT_STOCK') {                    // 庫存不足類錯誤
      return res.status(409).json({ error: 'INSUFFICIENT_STOCK', ...(err.data || {}) }) // 回 409 + 不足清單
    }
    console.error('❌ 建立訂單失敗:', err)                     // 其他錯誤 → 500
    res.status(500).json({ error: '伺服器錯誤' })
  } finally {
    await session.endSession()                                  // 無論成功或失敗都結束 session
  }

})
// 清空購物車 API
app.post('/api/cart/clear', express.json(), async (req, res) => {
  const { user_id } = req.body
   const db = req.app.locals.db

  try {
    // 清空 items，並更新時間
    const result = await db.collection('carts').updateOne(
      { user_id:  Number(user_id) },
      { $set: { items: [], updated_at: new Date() } }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: '購物車不存在' })
    }

    res.json({ message: '購物車已清空' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: '伺服器錯誤' })
  } 
})

// 取得特定會員的購買紀錄
app.get('/api/orders/:user_id', async (req, res) => {
  const user_id = parseInt(req.params.user_id)
  const db = req.app.locals.db

  try {

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
    const { amount, orderNo } = req.body

  if (!amount || !orderNo) {
    return res.status(400).json({ message: '缺少金額或訂單編號' })
  }
  console.log('🚀 金額 amount:', amount)
 console.log('🚀 訂單編號 orderNo:', orderNo)

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
  // TradeNo = 'test' + new Date().getTime();
  let base_param = {
    MerchantTradeNo: orderNo, //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
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
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).send('Invalid body')
  }

  const { CheckMacValue, RtnCode, MerchantTradeNo, PaymentType, TradeNo } = req.body
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

    
  const db = req.app.locals.db

  // ✅ 檢查驗證通過且交易成功
  try {
    if (RtnCode === '1' && CheckMacValue === checkValue) {
      const result = await db.collection('orders').updateOne(
        { order_id: MerchantTradeNo },
        {
          $set: {
            status: '已付款',
            paid_at: new Date(),
            payment_type: PaymentType,
            payment_no: TradeNo
          }
        }
      )

      console.log(`✅ 訂單 ${MerchantTradeNo} 狀態更新為「已付款」`)
    } else {
      console.warn(`⚠️ 訂單 ${MerchantTradeNo} 驗證失敗或非成功交易`)
    }

  } catch (err) {
    console.error(`❌ 更新訂單 ${MerchantTradeNo} 時發生錯誤:`, err)
  } 

 // 交易成功後，需要回傳 1|OK 給綠界
  res.send('1|OK');
});

//用戶交易完成後的轉址，付款成功頁面
app.get('/clientReturn', (req, res) => {
  res.send('<h1>✅ 付款完成，謝謝您的訂購！</h1>')
})


// app.listen(port, () => {
//   console.log(`✅ API Server running on http://localhost:${port}`)
// })
