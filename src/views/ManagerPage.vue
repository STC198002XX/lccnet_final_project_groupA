<template>
  <header class="header_area">
    <div class="main_menu">
      <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
          <!-- <a class="navbar-brand logo_h"><router-link to="/"><img src="/aroma/img/logo.png" alt=""></router-link></a> -->
          <img class="navbar-brand logo_h" src="/aroma/img/logo.png"  alt="">
          <button class="btn btn-danger mb-3" @click="handleLogout">登出</button>
          <div class="collapse navbar-collapse offset" id="navbarSupportedContent">
            <ul class="nav navbar-nav menu_nav ml-auto mr-auto">
              <h4 class="container mt-2">您好，{{ displayName }}</h4>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>

  <div class="admin-container">
    <h2>後台管理系統</h2>
    <ul class="nav nav-tabs">
      <li class="nav-item" v-for="tab in tabs" :key="tab.id">
        <a class="nav-link" :class="{ active: currentTab === tab.id }" href="#" @click.prevent="currentTab = tab.id">
          {{ tab.label }}
        </a>
      </li>
    </ul>

    <component :is="currentTabComponent" />
  </div>

  <footer class="footer mt-5">
    <div class="footer-area">
      <div class="container">
        <p class="text-center pt-5">© 2025 Aroma Shop. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'

import MemberOrdersTable from '@/components/MemberOrdersTable.vue'
import ProductInventory from '@/components/ProductInventory.vue' // ✅ 新增元件

import ProductForm from '@/components/ProductForm.vue'       // ✅ 元件加回去
import { useRouter, onBeforeRouteLeave } from 'vue-router'
const router = useRouter()
// import AdminForm from '@/components/AdminForm.vue'           // ❌ 註解

const currentTab = ref('memberOrders')

const tabs = [
  { id: 'memberOrders', label: '會員與訂單' },
  { id: 'products', label: '商品庫存' },
  { id: 'addProduct', label: '商品上架' } // ✅ 元件加回去
  // { id: 'admins', label: '新增管理員' }    // ❌ 註解
]

const currentTabComponent = computed(() => {
  switch (currentTab.value) {
    case 'memberOrders': return MemberOrdersTable
    case 'products': return ProductInventory
    case 'addProduct': return ProductForm
    // case 'admins': return AdminForm
  }
})

import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const displayName = computed(() => auth.userName || auth.userEmail)
// ✅ 安全登出
// ✅ 這裡的登出會清除 auth store 的使用者資料
const handleLogout = () => {
  alert('登出成功')
  auth.logout()
  router.push('/')
}

onBeforeRouteLeave((to, from, next) => {
  console.log('⚠️ 離開管理者頁面，自動登出')

  // ✅ 安全登出（先執行登出動作）
  auth.logout()

  // ✅ 延遲導向首頁，避免 router.push 和 next() 衝突
  setTimeout(() => {
    router.push('/')  // 轉回首頁
  }, 10)

  // ✅ 仍然呼叫 next() 讓路由繼續（否則卡住）
  next()
})
</script>
