const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')

const app = express()
const port = 3000
const uri = 'mongodb://localhost:27017'
const dbName = 'aroma'

app.use(cors())
app.use(express.json())

// 登入 API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(dbName)
    const user = await db.collection('users').findOne({ email })

    if (!user || user.password !== password) {
      return res.status(401).json({ message: '帳號或密碼錯誤' })
    }

    res.json({
      message: '登入成功',
      token: 'fake-jwt-token',           // 可改為 JWT 實作
      manager: user.manager === true     // 是否為管理員
    })
  } catch (err) {
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

// 取得一般會員（非管理員）資料
app.get('/api/users', async (req, res) => {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(dbName)
    const users = await db.collection('users')
      .find({ manager: false }, { projection: { password: 0 } })
      .toArray()

    // 加入每個使用者的測試訂單（前端先不連結 orders collection）
    const usersWithOrders = users.map(user => ({
      ...user,
      orders: [
        { id: '#TEST1001', amount: '$999', status: '測試出貨' }
      ]
    }))

    res.json(usersWithOrders)
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤', error: err.message })
  } finally {
    await client.close()
  }
})

app.listen(port, () => {
  console.log(`✅ API Server running on http://localhost:${port}`)
})
