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

app.listen(port, () => {
  console.log(`✅ API Server running on http://localhost:${port}`)
})
