<template>
  <form @submit.prevent="handleSubmit" class="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-4">
    <header class="header_area">
      <div class="main_menu">
        <nav class="navbar navbar-expand-lg navbar-light">
          <div class="container">
            <a class="navbar-brand logo_h"><router-link to="/"><img src="/aroma/img/logo.png" alt=""></router-link></a>
            <div class="collapse navbar-collapse offset" id="navbarSupportedContent">
              <ul class="nav navbar-nav menu_nav ml-auto mr-auto">
                <h4 class="container mt-2">忘記密碼？</h4>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>

  <div>
      <label class="block text-sm font-medium">電子郵件</label>
      <input
        type="email"
        v-model="email"
        class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium">新密碼</label>
      <input
        v-model="newPassword"
        type="password"
        class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium">確認新密碼</label>
      <input
        v-model="confirmPassword"
        type="password"
        class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    <div v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</div>
    <div v-if="successMessage" class="text-green-600 text-sm">{{ successMessage }}</div>

    <button type="submit" class="nav-item">確認修改</button>
    <p class="text-center text-sm text-gray-500">
      <router-link to="/" class="text-blue-500 hover:underline">回首頁</router-link>
    </p>

    <footer class="footer mt-5">
      <div class="footer-area">
        <div class="container">
          <p class="text-center pt-5">© 2025 Aroma Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>

  </form>
</template>

<script setup>
import { ref } from 'vue'

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const errorMessage = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = '請填寫所有欄位'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = '新密碼與確認密碼不相符'
    return
  }

  try {
    const res = await fetch('http://localhost:3000/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
      })
    })

    if (!res.ok) throw new Error('密碼更新失敗')

    successMessage.value = '密碼更新成功'
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err) {
    errorMessage.value = err.message || '發生錯誤'
  }
}
</script>
