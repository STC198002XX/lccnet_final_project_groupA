<template>
  <div class="container mt-5">
    <h2>🛒 購物車清單</h2>

    <!-- 表格 -->
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

    <!-- 沒有商品時 -->
    <div v-else>
      <p>購物車是空的。</p>
    </div>

    <!-- 總價與操作按鈕 -->
    <div class="text-right mt-4" v-if="cart.items.length > 0">
      <h4>總金額：${{ cart.totalPrice.toFixed(2) }}</h4>
      <button class="btn btn-warning mt-3" @click="cart.clearCart()">清空購物車</button>

      <!-- ✅ 加入的「前往結帳」按鈕 -->
      <router-link to="/checkout">
        <button class="btn btn-primary mt-3 ml-2">前往結帳</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()
console.log('🛒 購物車頁面載入時的項目：', cart.items)

// 增加數量
function increase(id) {
  const item = cart.items.find(p => p.id === id)
  if (item) item.quantity++
}

// 減少數量（最小為 1）
function decrease(id) {
  const item = cart.items.find(p => p.id === id)
  if (item && item.quantity > 1) {
    item.quantity--
  }
}
</script>
