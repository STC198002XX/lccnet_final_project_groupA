import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import ResetPasswordPage from '@/views/ResetPasswordPage.vue'
import Shop from '../views/CategoryView.vue'
import Product from '../views/ProductView.vue'
import ManagerPage from '@/views/ManagerPage.vue' // ✅ 新增管理者頁面
import ProfilePage from '@/views/ProfilePage.vue' // ✅ 會員頁面（建議有）

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/shop', name: 'Shop', component: Shop },
  { path: '/product/:id', name: 'Product', component: Product },
  { path: '/member/reset-password', component: ResetPasswordPage },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/checkout', name: 'Checkout', component: Checkout },
  { path: '/manager', component: ManagerPage, meta: { requiresManager: true } }, // ✅ 受保護頁面
  { path: '/member/profile', component: ProfilePage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ 全域守衛：阻擋未授權訪問 /manager
router.beforeEach((to, from, next) => {
  const isManager = localStorage.getItem('manager') === 'true'

  if (to.meta.requiresManager && !isManager) {
    return next('/') // 未授權者導回首頁
  }

  next()
})

export default router
