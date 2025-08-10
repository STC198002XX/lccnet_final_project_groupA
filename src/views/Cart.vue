<template>
  <div>
    <!-- 共用 Header -->
    <Header :cartCount="cart.items.length" />

    <!-- 原本內容 -->
    <div class="container mt-5">
      <h2>🛒 購物車清單</h2>

      <table class="table table-bordered mt-4" v-if="cart.items.length > 0">
        <thead>
          <tr>
            <th>商品名稱</th>
            <th>單價</th>
            <th>數量</th>
            <th>總價</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart.items" :key="item.id">
            <td>{{ item.name }}</td>
            <td>${{ item.price.toFixed(2) }}</td>
            <td>{{ item.quantity }}</td>
            <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
            <td>
              <button class="btn btn-sm btn-success" @click="increase(item.id)">＋</button>
              <button class="btn btn-sm btn-warning mx-1" @click="decrease(item.id)">－</button>
              <button class="btn btn-sm btn-danger" @click="cart.removeItem(item.id)">❌</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else>
        <p>購物車是空的。</p>
      </div>

      <div class="text-right mt-4" v-if="cart.items.length > 0">
        <h4>總金額：${{ cart.totalPrice.toFixed(2) }}</h4>
        <button class="btn btn-warning mt-3" @click="cart.clearCart()">清空購物車</button>
        <router-link to="/checkout">
          <button class="btn btn-primary mt-3 ml-2">前往結帳</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()

function increase(id) {
   const product = cart.items.find(p => p.id === id)
  if (product) {
    cart.addItem(product)
  }
}

function decrease(id) {
  const item = cart.items.find(p => p.id === id)
  if (item && item.quantity > 1) {
    const newQty = item.quantity - 1
    cart.updateQuantity(id, newQty)  // ✅ 同步到後端
  }
}
</script>
