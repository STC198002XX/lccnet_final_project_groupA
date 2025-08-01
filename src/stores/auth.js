// stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCartStore } from './cart'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const userEmail = ref('')
  const userName = ref('')
  const isManager = ref(false)
  const user = ref(null)

  function setAuth({ token: t, userEmail: e, userName: n, isManager: m, user: u}) {
    token.value = t
    userEmail.value = e
    userName.value = n
    isManager.value = m
    user.value = u
  }

  function logout() {
    token.value = ''
    userEmail.value = ''
    userName.value = ''
    isManager.value = false
    user.value = null
    localStorage.clear()

    // ✅ 清空購物車
    const cart = useCartStore()
    cart.clearCart()

    // ✅ 清除 localStorage（或只清除必要項目）
    // localStorage.clear()
    localStorage.removeItem('pinia-cart')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('token')
  }

  function initFromLocal() {
    token.value = localStorage.getItem('token') || ''
    userEmail.value = localStorage.getItem('userEmail') || ''
    userName.value = localStorage.getItem('userName') || ''
    isManager.value = JSON.parse(localStorage.getItem('isManager') || 'false')
    const userData = localStorage.getItem('user')
    user.value = userData ? JSON.parse(userData) : null
  }

  return { token, userEmail, userName, isManager, user, setAuth, logout, initFromLocal}
})


