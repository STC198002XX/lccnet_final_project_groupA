<!-- components/CartPopup.vue -->
<template>
  <div class="cart-popup" v-if="cart.showPopup">
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
        <button class="btn btn-sm btn-secondary" @click="cart.showPopup = false">關閉</button>
        <router-link to="/checkout" class="btn btn-sm btn-success">前往結帳</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()
</script>

<style scoped>
.cart-popup { position: fixed; top: 90px; right: 20px; width: 320px; background: #fff; border: 1px solid #ddd; box-shadow: 0 0 12px rgba(0, 0, 0, 0.15); padding: 15px; z-index: 1000; border-radius: 8px; }
.cart-item { display: flex; gap: 10px; align-items: center; padding: 6px 0; border-bottom: 1px solid #eee; }
.cart-item-image { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; }
.cart-item-info { flex: 1; }
</style>
