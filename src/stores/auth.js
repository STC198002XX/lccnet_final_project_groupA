// stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

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
  }

  return { token, userEmail, userName, isManager, setAuth, logout }
})


