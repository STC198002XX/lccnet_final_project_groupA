<template>
  <!-- Header 區塊 -->
  <header class="header_area">
    <div class="main_menu">
      <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
          <router-link to="/"  @click="console.log('Going home')"><img src="/aroma/img/logo.png" alt=""></router-link>
          <!-- <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
            <span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>
          </button> -->
          <div class="collapse navbar-collapse offset" id="navbarSupportedContent">
            <ul class="nav navbar-nav menu_nav ml-auto mr-auto">
              <li class="nav-item active"><router-link to="/" class="nav-link">Home</router-link></li>
              <li class="nav-item active"><router-link to="/shop" class="nav-link">Shop</router-link></li>
            </ul>
            <ul class="nav-shop">
              <li class="nav-item"><button><i class="ti-search"></i></button></li>
              <li class="nav-item">
                <button @click="showCart = !showCart">
                  <i class="ti-shopping-cart"></i>
                  <span class="nav-shop__circle">{{ cart.items.length }}</span>
                </button>
              </li>
              <li class="nav-item" v-if="isHome"><a class="button button-header" href="#" @click.prevent="scrollToTrending">Buy Now</a></li>
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
</template>

<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
// import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
// const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const showCart = ref(false)
const trendingSection = ref(null)

const isLoggedIn = computed(() => !!auth.token)
const displayName = computed(() => auth.userName || auth.userEmail)

const isHome = computed(() => route.path === '/')
// function addToCart(product) {
//   cart.addItem({ ...product, quantity: 1 })
//   showCart.value = true
// }


function scrollToTrending() {
  if (trendingSection.value) {
    trendingSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
