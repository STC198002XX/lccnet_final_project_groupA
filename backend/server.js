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
  api_secret: process.env.CLOUD_API_SECRET
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
      email: user.email,
      name: user.name
  }
    })
  } catch (err) {
    console.error('❌ 登入發生錯誤:', err)
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
    res.status(500).json({ message: '伺服器錯誤1040729', error: err.message })
  } finally {
    await client.close()
  }
})

app.listen(port, () => {
  console.log(`✅ API Server running on http://localhost:${port}`)
})
