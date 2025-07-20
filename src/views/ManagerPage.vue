<template>
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
  <div class="admin-container">
    <h2>後台管理系統</h2>
    <ul class="nav nav-tabs">
      <li class="nav-item" v-for="tab in tabs" :key="tab.id">
        <a class="nav-link" :class="{ active: currentTab === tab.id }" href="#" @click.prevent="currentTab = tab.id">{{ tab.label }}</a>
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
import MemberTable from '@/components/MemberTable.vue'
import OrderTable from '@/components/OrderTable.vue'
import ProductForm from '@/components/ProductForm.vue'
import AdminForm from '@/components/AdminForm.vue'

const currentTab = ref('members')

const tabs = [
  { id: 'members', label: '會員管理' },
  { id: 'orders', label: '訂單管理' },
  { id: 'products', label: '商品上架' },
  { id: 'admins', label: '新增管理員' }
]

const currentTabComponent = computed(() => {
  switch (currentTab.value) {
    case 'members': return MemberTable
    case 'orders': return OrderTable
    case 'products': return ProductForm
    case 'admins': return AdminForm
  }
})
</script>
