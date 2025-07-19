// backend/index.js
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3000

app.use(cors()) // 允許跨域
app.use(express.json()) // 解析 JSON

// 暫時性的 login API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body
//測試管理者頁面
  if (email === 'test@example.com' && password === '1140719') {
    return res.json({
      email: email,
      manager: true,
      token: 'fake-jwt-token-for-manager' // ✅ 新增 token
    })
  }
//測試非管理者頁面
  if (email === 'user@example.com' && password === '1140718') {
    return res.json({
      email: email,
      manager: false,
      token: 'fake-jwt-token-for-user' // ✅ 新增 token
    })
  }

  return res.status(401).json({ message: '帳號或密碼錯誤' })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
