<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <LoginForm />
  </div>
</template>

<script setup>
import LoginForm from '@/components/LoginForm.vue'
// import { useAuthStore } from '@/stores/auth'

// const auth = useAuthStore()

// // 登入
// auth.login({ name: '王小明', email: 'test@example.com' })

// // 顯示名稱
// console.log(auth.user.name)  // 王小明

// // 登出
// auth.logout()
</script>

<!-- src/views/LoginPage.vue -->
<!-- <template>
  <div class="login-page">
    <h2>會員登入</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="密碼" required />
      <button type="submit">登入</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // ✅ 注意路徑是否正確

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const authStore = useAuthStore() // ✅ 呼叫 store

const handleLogin = async () => {
  try {
    // 模擬後端驗證（可換成 fetch 實作）
    if (email.value === 'test@example.com' && password.value === '123456') {
      const fakeUser = { email: email.value, name: '測試用戶' }
      authStore.login(fakeUser)
      router.push('/profile') // 登入成功後導向會員頁
    } else {
      errorMessage.value = '帳號或密碼錯誤'
    }
  } catch (err) {
    errorMessage.value = '發生錯誤，請稍後再試'
  }
}
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
input {
  padding: 10px;
  font-size: 1rem;
}
button {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
.error {
  color: red;
}
</style> -->
