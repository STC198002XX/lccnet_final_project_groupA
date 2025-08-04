<template>
  <div>
    <!-- Header 區塊 -->
    <header class="header_area">
      <div class="main_menu">
        <nav class="navbar navbar-expand-lg navbar-light">
          <div class="container">
            <a class="navbar-brand logo_h" href="#"><img src="/aroma/img/logo.png" alt=""></a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
              <span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>
            </button>
            <div class="collapse navbar-collapse offset" id="navbarSupportedContent">
              <ul class="nav navbar-nav menu_nav ml-auto mr-auto">
                <li class="nav-item active"><a class="nav-link" href="#">Home</a></li>
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

    <!-- Hero 區塊 -->
    <section class="hero-banner">
      <div class="container">
        <div class="row no-gutters align-items-center pt-60px">
          <div class="col-5 d-none d-sm-block">
            <div class="hero-banner__img">
              <img class="img-fluid" src="/aroma/img/home/hero-banner.png" alt="">
            </div>
          </div>
          <div class="col-sm-7 col-lg-6 offset-lg-1 pl-4 pl-md-5 pl-lg-0">
            <div class="hero-banner__content">
              <h4>Shop is fun</h4>
              <h1>Browse Our Premium Product</h1>
              <p>Us which over of signs divide dominion deep fill bring...</p>
              <!-- <a class="button button-hero" href="#">Browse Now</a> -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Products 區塊 -->
    <section ref="trendingSection" class="section-margin calc-60px">
      <div class="container">
        <div class="section-intro pb-60px">
          <p>Popular Item in the market</p>
          <h2>Trending <span class="section-intro__style">Product</span></h2>
        </div>
        <div class="row">
          <div v-for="product in products" :key="product.id" class="col-md-6 col-lg-4 col-xl-3">
            <div class="card text-center card-product">
              <router-link :to="`/product/${product.id}`">
                <div class="card-product__img">
                  <img class="card-img" :src="product.image" :alt="product.name" />
                </div>
              </router-link>
              <div class="card-body">
                <p>{{ product.category }}</p>
                <h4 class="card-product__title">{{ product.name }}</h4>
                <p class="card-product__price">${{ product.price }}</p>
                <button class="btn btn-sm btn-primary mt-2" @click="handleAddToCart(product)">
                  🛒 加入購物車
                </button>
              </div>
            </div>
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

    <!-- Footer 區塊 -->
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
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const cart = useCartStore()
const showCart = ref(false)
const trendingSection = ref(null)

const isLoggedIn = computed(() => !!auth.token && !!auth.userEmail)
const displayName = computed(() => auth.userName || auth.userEmail)

const products = [
  {
    id: "product_0043",
    name: "Premium Reed Diffuser 3000 ML - Bulgarian Rose & Oud",
    price: 1350,
    category: "Diffusers",
    image: "/aroma/img/NewProducts/Premium_Reed_Diffuser_3000_ML_-_Bulgarian_Rose_&_O.jpg"
  },
  {
    id: "product_0073",
    name: "Omani lime lipbalm",
    price: 68,
    category: "Body Care",
    image: "/aroma/img/NewProducts/Omani_lime_lipbalm.jpg"
  },
  {
    id: "product_0017",
    name: "3 wick XL Candle - Velvet Wood",
    price: 265,
    category: "Candles",
    image: "/aroma/img/NewProducts/3_wick_XL_Candle_-_Velvet_Wood.jpg"
  },
  {
    id: "product_0024",
    name: "Omani Frankincense",
    price: 142,
    category: "Diffusers",
    image: "/aroma/img/NewProducts/Omani_Frankincense.jpg"
  },
  {
    id: "product_0089",
    name: "Minois bubble bath",
    price: 125,
    category: "Kids",
    image: "/aroma/img/NewProducts/Minois_bubble_bath.jpg"
  },
  {
    id: "product_0079",
    name: "Dukhoon No.2",
    price: 105,
    category: "Mukhallat",
    image: "/aroma/img/NewProducts/Dukhoon_No.2.jpg"
  },
  {
    id: "product_0083",
    name: "PMLM04",
    price: 262,
    category: "Perfumes",
    image: "/aroma/img/NewProducts/PMLM04.jpg"
  },
  {
    id: "product_0052",
    name: "All Over Spray Rose",
    price: 220,
    category: "Room Spray",
    image: "/aroma/img/NewProducts/All_Over_Spray_Rose.jpg"
  }
]

function addToCart(product) {
  cart.addItem({ ...product, quantity: 1 })
  showCart.value = true
}


function scrollToTrending() {
  if (trendingSection.value) {
    trendingSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

function handleCartClick() {
  if (!isLoggedIn.value) {
    alert('請先登入')
    return
  }
  showCart.value = !showCart.value
}

function handleAddToCart(product) {
  if (!isLoggedIn.value) {
    alert('請先登入')
    return
  }

  addToCart(product) // 假設你已經有定義這個方法
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
