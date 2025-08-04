<template>
  <form @submit.prevent="handleRegister" class="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow space-y-4">
    <header class="header_area">
      <div class="main_menu">
        <nav class="navbar navbar-expand-lg navbar-light">
          <div class="container">
            <router-link to="/" class="navbar-brand logo_h"><img src="/aroma/img/logo.png" alt=""></router-link>
            <div class="collapse navbar-collapse offset" id="navbarSupportedContent">
              <ul class="nav navbar-nav menu_nav ml-auto mr-auto">
                <h4 class="container mt-2">註冊</h4>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>

    <div>
      <label class="block text-sm font-medium">姓名</label>
      <input
        v-model="name"
        type="text"
        class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium">電子郵件</label>
      <input
        v-model="email"
        type="email"
        class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    <!-- <div>
      <label class="block text-sm font-medium">密碼</label>
      <input
        v-model="password"
        type="password"
        class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium">確認密碼</label>
      <input
        v-model="confirmPassword"
        type="password"
        class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div> -->

    <div>
      <label class="block text-base font-medium leading-[2.5rem]">密碼</label>
      <div class="relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          class="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <span
          @click="togglePasswordVisibility"
          class="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 text-base"
          title="顯示/隱藏密碼"
        >
          {{ showPassword ? '🙈' : '👁️' }}
        </span>
      </div>
    </div>

    <div>
      <label class="block text-base font-medium leading-[2.5rem]">確認密碼</label>
      <div class="relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="confirmPassword"
          class="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <span
          @click="togglePasswordVisibility"
          class="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 text-base"
          title="顯示/隱藏密碼"
        >
          {{ showPassword ? '🙈' : '👁️' }}
        </span>
      </div>
    </div>

    <div v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</div>

    <button
      type="submit"
      class="nav-item"
    >
      註冊
    </button>

    <p class="text-center text-sm text-gray-500">
      已有帳號？
      <router-link to="/login" class="text-blue-500 hover:underline">前往登入</router-link>
    </p>
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
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const router = useRouter()

const showPassword = ref(false)
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = '請填寫所有欄位'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = '密碼與確認密碼不相符'
    return
  }

  try {
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value
      })
    })
    const data = await res.json()

    if (!res.ok) throw new Error(data.message || '註冊失敗')

    // 註冊成功後導向登入
    alert('註冊成功') 
    router.push('/login')
  } catch (err) {
    errorMessage.value = err.message
  }
}
</script>
