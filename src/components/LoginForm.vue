<template>
  <form @submit.prevent="handleLogin" class="w-full max-w-sm mx-auto bg-white p-6 rounded-xl shadow space-y-4">

    <header class="header_area">
      <div class="main_menu">
        <nav class="navbar navbar-expand-lg navbar-light">
          <div class="container">
            <a class="navbar-brand logo_h"><router-link to="/"><img src="/aroma/img/logo.png" alt=""></router-link></a>
            <div class="collapse navbar-collapse offset" id="navbarSupportedContent">
              <ul class="nav navbar-nav menu_nav ml-auto mr-auto">
                <h4 class="container mt-2">登入</h4>
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

    <!-- <div>
      <label class="block text-sm font-medium">密碼</label>
      <input
        type="password"
        v-model="password"
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


    <div v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</div>

    <button type="submit" class="nav-item">登入</button>

    <p class="text-sm text-gray-500"><router-link to="/member/reset-password">忘記密碼？</router-link></p>

    <p class="text-center text-sm text-gray-500">
      還沒有帳號？
      <router-link to="/register" class="text-blue-500 hover:underline">前往註冊</router-link>
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
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const auth = useAuthStore()

const showPassword = ref(false)
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = '請填寫所有欄位'
    return
  }

  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    const data = await res.json()
    console.log('登入回傳資料：', data)
    console.log('回傳 user：', data.user)
    if (!res.ok) throw new Error(data.message || '登入失敗')

    // 儲存登入狀態 (範例：localStorage + Pinia 可擴充)
   // localStorage.setItem('token', data.token)
    localStorage.setItem('manager', data.manager) // 👈 加上這行，才能跳往/manager
    localStorage.setItem('userEmail', data.user.email)
    localStorage.setItem('userName', data.user.name)

    auth.setAuth({
      token: data.token,
      userEmail: data.user.email,
      userName: data.user.name,
      isManager: data.manager,
      user: data.user
    })

    localStorage.setItem('token', data.token)
    localStorage.setItem('userEmail', data.user.email)
    localStorage.setItem('userName', data.user.name)
    localStorage.setItem('isManager', JSON.stringify(data.manager))
    localStorage.setItem('user', JSON.stringify(data.user))
    
    //加入跳轉管理者頁面
    if (data.manager === true) {
      router.push('/manager') 
    } else {
      router.push('/')
      // router.push('/member/profile')
    }

  } catch (err) {
    errorMessage.value = err.message
  }
}
</script>

