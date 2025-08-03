<template>
  <div>
    <!-- Header Area -->
    <header class="header_area">
      <div class="main_menu">
        <nav class="navbar navbar-expand-lg navbar-light">
          <div class="container">
            <router-link to="/" class="navbar-brand logo_h"><img src="/aroma/img/logo.png" alt=""></router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
              <span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>
            </button>
            <div class="collapse navbar-collapse offset" id="navbarSupportedContent">
              <ul class="nav navbar-nav menu_nav ml-auto mr-auto">
                <li class="nav-item active"><router-link to="/" class="nav-link">Home</router-link></li>
                <li class="nav-item active"><router-link to="/shop" class="nav-link">Shop</router-link></li>
              </ul>
              <ul class="nav-shop">
                <li class="nav-item">
                  <button @click="handleCartClick">
                    <i class="ti-shopping-cart"></i>
                    <span class="nav-shop__circle">{{ cart.items.length }}</span>
                  </button>
                </li>
                <li class="nav-item"><a class="button button-header" href="#" @click.prevent="scrollToTrending">Buy Now</a></li>
              </ul>

                <!-- 如果已登入 -->
              <ul class="nav navbar-nav menu_nav" v-if="isLoggedIn">
                <li class="nav-item">
                  <span class="nav-link">您好，{{ displayName }}</span>
                </li>
                <li class="nav-item">
                  <span class="nav-link text-gray-200">|</span>
                </li>
                <li class="nav-item">
                  <router-link to="/member/profile" class="nav-link">會員中心</router-link>
                </li>
                <li class="nav-item">
                  <span class="nav-link text-gray-200">|</span>
                </li>
                <li class="nav-item mt-10">
                  <a href="#" class="nav-link" @click="auth.logout">登出</a>
                </li>
              </ul>
              
              <!-- 如果未登入 -->
              <ul class="nav navbar-nav menu_nav" v-else>
                <li class="nav-item active">
                  <router-link to="/login" class="nav-link">登入</router-link>
                  <span class="mx-1 text-gray-200">|</span>
                  <router-link to="/register" class="nav-link">註冊</router-link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
    <!-- Banner -->
    <BannerProps title="Shop" subtitle="Home - Shop"/>
  
    <!-- 商品與篩選 -->
    <section class="section-margin--small mb-5">
      <div class="container">
        <div class="row">
          <div class="col-xl-9 col-lg-8 col-md-7">
            <ProductGrid />
          </div>
        </div>
      </div>
    </section>
    
    <!-- ✅ 彈出購物車視窗 -->
    <div class="cart-popup" v-if="showCart">
      <div class="cart-popup-inner">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5>🛒 購物車</h5>
          <router-link to="/cart" class="btn btn-sm btn-info">管理購物車</router-link>
        </div>

        <ul>
          <li v-for="item in cart.items" :key="item.id" class="cart-item">
            <img :src="item.image" alt="商品圖片" class="cart-item-image" />
            <div class="cart-item-info">
              <p class="mb-1">{{ item.name }} × {{ item.quantity }}</p>
              <p class="mb-0 text-muted">${{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
          </li>
        </ul>

        <p class="mt-2"><strong>總金額：</strong> ${{ cart.totalPrice.toFixed(2) }}</p>

        <div class="d-flex justify-content-between mt-3">
          <button class="btn btn-sm btn-secondary" @click="showCart = false">關閉</button>
          <router-link to="/checkout" class="btn btn-sm btn-success">前往結帳</router-link>
        </div>
      </div>
    </div>

      <!-- Footer -->
    <footer class="footer mt-5">
      <div class="footer-area">
        <div class="container">
          <p class="text-center pt-5">© 2025 Aroma Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref} from 'vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import BannerProps from '../components/BannerProps.vue'
import ProductGrid from '../components/ProductGrid.vue'
const cart = useCartStore()
const showCart = ref(false)
const trendingSection = ref(null)

const auth = useAuthStore()
auth.initFromLocal()
// 判斷是否登入
const isLoggedIn = computed(() => !!auth.token)

// 顯示名稱：優先顯示 userName，其次是 email 的帳號部分
const displayName = computed(() => {
  return auth.userName || auth.userEmail?.split('@')[0] || '用戶'
})

function handleCartClick() {
  if (!isLoggedIn.value) {
    alert('請先登入')
    return
  }
  showCart.value = !showCart.value
}

function scrollToTrending() {
  if (trendingSection.value) {
    trendingSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

</script>

<style scoped>
.cart-popup {
  position: fixed;
  top: 90px;
  right: 20px;
  width: 320px;
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
  padding: 15px;
  z-index: 1000;
  border-radius: 8px;
}
.cart-popup-inner {
  font-size: 14px;
}
.cart-popup-inner ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.cart-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}
.cart-item-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}
.cart-item-info {
  flex: 1;
}
</style>