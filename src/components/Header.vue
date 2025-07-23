<template>
  <!-- Header 區塊 -->
  <header class="header_area">
    <div class="main_menu">
      <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
          <router-link class="navbar-brand logo_h" to="/">
            <img src="/aroma/img/logo.png" alt="logo">
          </router-link>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
            <span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>
          </button>
          <div class="collapse navbar-collapse offset" id="navbarSupportedContent">
            <ul class="nav navbar-nav menu_nav ml-auto mr-auto">
              <li class="nav-item active">
                <router-link to="/" class="nav-link">Home</router-link>
              </li>
            </ul>
            <ul class="nav-shop">
              <li class="nav-item"><button><i class="ti-search"></i></button></li>
              <li class="nav-item">
                <button @click="$emit('toggle-cart')">
                  <i class="ti-shopping-cart"></i>
                  <span class="nav-shop__circle">{{ cartCount }}</span>
                </button>
              </li>
              <li class="nav-item"><a class="button button-header" href="#">Buy Now</a></li>
            </ul>
            <ul class="nav navbar-nav menu_nav">
              <li class="nav-item active">
                <router-link to="/login" class="nav-link">登入</router-link>
              </li>
            </ul>
            <ul>/</ul>
            <ul class="nav navbar-nav menu_nav">
              <li class="nav-item active">
                <router-link to="/register" class="nav-link">註冊</router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
    cartCount: {
      type: Number,
      default: 0
    }
  }
}
</script>
