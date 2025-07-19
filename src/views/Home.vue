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
              </ul>
              <ul class="nav-shop">
                <li class="nav-item"><button><i class="ti-search"></i></button></li>
                <li class="nav-item">
                  <button @click="showCart = !showCart">
                    <i class="ti-shopping-cart"></i>
                    <span class="nav-shop__circle">{{ cart.items.length }}</span>
                  </button>
                </li>
                <li class="nav-item"><a class="button button-header" href="#">Buy Now</a></li>
              </ul>
              <ul class="nav navbar-nav menu_nav">
                <li class="nav-item active">
                  <router-link to="/login" class="nav-link">登入&nbsp;</router-link>
                </li>
              </ul>
              <ul>/</ul>
              <ul class="nav navbar-nav menu_nav">
                <li class="nav-item active">
                  <router-link to="/register" class="nav-link">&nbsp;註冊</router-link>
                </li>
              </ul>
              <!-- 如果已登入 -->
              <!-- <ul class="nav navbar-nav menu_nav" v-if="auth.isLoggedIn">
                <li class="nav-item">
                  <span class="nav-link">您好，{{ auth.user.name }}</span>
                </li>
                <li class="nav-item">
                  <router-link to="/profile" class="nav-link">會員中心</router-link>
                </li>
                <li class="nav-item">
                  <button class="nav-link" @click="auth.logout">登出</button>
                </li>
              </ul> -->
              
              <!-- 如果未登入 -->
              <!-- <ul class="nav navbar-nav menu_nav" v-else>
                <li class="nav-item">
                  <router-link to="/login" class="nav-link">登入</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/register" class="nav-link">註冊</router-link>
                </li>
              </ul> -->
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
              <a class="button button-hero" href="#">Browse Now</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Products 區塊 -->
    <section class="section-margin calc-60px">
      <div class="container">
        <div class="section-intro pb-60px">
          <p>Popular Item in the market</p>
          <h2>Trending <span class="section-intro__style">Product</span></h2>
        </div>
        <div class="row">
          <div v-for="product in products" :key="product.id" class="col-md-6 col-lg-4 col-xl-3">
            <div class="card text-center card-product">
              <div class="card-product__img">
                <img class="card-img" :src="product.image" :alt="product.name" />
                <ul class="card-product__imgOverlay">
                  <li><button><i class="ti-search"></i></button></li>
                  <li><button><i class="ti-shopping-cart"></i></button></li>
                  <li><button><i class="ti-heart"></i></button></li>
                </ul>
              </div>
              <div class="card-body">
                <p>{{ product.category }}</p>
                <h4 class="card-product__title"><a href="#">{{ product.name }}</a></h4>
                <p class="card-product__price">${{ product.price }}</p>
                <button class="btn btn-sm btn-primary mt-2" @click="addToCart(product)">
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
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const showCart = ref(false)

const products = [
  {
    id: 1,
    name: 'Quartz Belt Watch',
    price: 150,
    category: 'Accessories',
    image: '/aroma/img/product/product1.png'
  },
  {
    id: 2,
    name: 'Women Freshwash',
    price: 120,
    category: 'Beauty',
    image: '/aroma/img/product/product2.png'
  },
  {
    id: 3,
    name: 'Room Flash Light',
    price: 90,
    category: 'Decor',
    image: '/aroma/img/product/product3.png'
  },
  {
    id: 4,
    name: 'Room Flash Light',
    price: 90,
    category: 'Decor',
    image: '/aroma/img/product/product4.png'
  },
  {
    id: 5,
    name: 'Man Office Bag',
    price: 180,
    category: 'Accessories',
    image: '/aroma/img/product/product5.png'
  },
  {
    id: 6,
    name: 'Charging Car',
    price: 200,
    category: 'Kids Toy',
    image: '/aroma/img/product/product6.png'
  },
  {
    id: 7,
    name: 'Blutooth Speaker',
    price: 100,
    category: 'Accessories',
    image: '/aroma/img/product/product7.png'
  },
  {
    id: 8,
    name: 'Charging Car',
    price: 200,
    category: 'Kids Toy',
    image: '/aroma/img/product/product8.png'
  }
]

function addToCart(product) {
  cart.addItem({ ...product, quantity: 1 })
  showCart.value = true
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
