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
                  <button @click="showCart = !showCart">
                    <i class="ti-shopping-cart"></i>
                    <span class="nav-shop__circle" v-if="cart && cart.items">{{ cart?.items?.length || 0 }}</span>
                  </button>
                </li>
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
  
<script>
  import BannerProps from '../components/BannerProps.vue'
  import ProductGrid from '../components/ProductGrid.vue'
  
  export default {
    name: 'CategoryView',
    components: {
      BannerProps,
      ProductGrid,
    }
  }
</script>