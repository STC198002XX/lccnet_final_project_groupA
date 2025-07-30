// stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCartStore } from './cart'

export const useAuthStore = defineStore('auth', () => {
  const token = ref('')
  const userEmail = ref('')
  const userName = ref('')
  const isManager = ref(false)

  function setAuth({ token: t, userEmail: e, userName: n, isManager: m }) {
    token.value = t
    userEmail.value = e
    userName.value = n
    isManager.value = m
  }

  function logout() {
    token.value = ''
    userEmail.value = ''
    userName.value = ''
    isManager.value = false
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

  return { token, userEmail, userName, isManager, setAuth, logout }
})


