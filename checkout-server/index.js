// index.js
const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')

const app = express()
app.use(cors())               // ✅ 這一行很重要
app.use(express.json())

// 連線字串（記得替換成你自己的）
const uri = 'mongodb+srv://shopuser:855250aa@cluster0.q7ygnhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

// 建立 MongoClient
const client = new MongoClient(uri)
let ordersCollection

// 連線後初始化 collection
async function connectDB() {
  try {
    await client.connect()
    const db = client.db('shop') // 資料庫名稱
    ordersCollection = db.collection('orders') // 資料表（集合）名稱
    console.log('✅ MongoDB 已連線成功')
  } catch (err) {
    console.error('❌ MongoDB 連線失敗：', err)
  }
}
connectDB()

// 📥 接收前端送來的訂單
app.post('/api/orders', async (req, res) => {
  try {
    const { name, address, phone, note, items } = req.body
    const order = {
      name,
      address,
      phone,
      note,
      items,
      createdAt: new Date()
    }

    const result = await ordersCollection.insertOne(order)
    res.json({ success: true, insertedId: result.insertedId })
  } catch (err) {
    console.error('❌ 儲存失敗：', err)
    res.status(500).json({ success: false, error: '儲存訂單失敗' })
  }
})

app.listen(3000, () => {
  console.log('🚀 Server 已啟動：http://localhost:3000')
})
