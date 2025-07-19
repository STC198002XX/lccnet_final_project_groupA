import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Cart from '../views/Cart.vue' // ✅ 加這行
import Checkout from '../views/Checkout.vue' // ✅ 補上這一行
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import ResetPasswordPage from '@/views/ResetPasswordPage.vue'


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/member/reset-password', component: ResetPasswordPage },
  { path: '/cart', name: 'Cart', component: Cart }, // ✅ 加這行
  { path: '/checkout', name: 'Checkout', component: Checkout } // ✅ 加這行
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
