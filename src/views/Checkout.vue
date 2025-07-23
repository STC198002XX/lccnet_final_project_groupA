<template>
  <div>
    <!-- 共用 Header -->
    <Header :cartCount="cart.items.length" />
    
    <!-- 原本的內容 -->
    <div class="container mt-5">
      <h2>📝 結帳表單</h2>

      <form @submit.prevent="submitOrder">
        <div class="form-group">
          <label>姓名</label>
          <input v-model="form.name" type="text" class="form-control" required>
        </div>
        <div class="form-group">
          <label>地址</label>
          <input v-model="form.address" type="text" class="form-control" required>
        </div>
        <div class="form-group">
          <label>電話</label>
          <input v-model="form.phone" type="text" class="form-control" required>
        </div>
        <div class="form-group">
          <label>備註</label>
          <textarea v-model="form.note" class="form-control"></textarea>
        </div>

        <button class="btn btn-success mt-3" type="submit">送出訂單</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'   // 新增的
import { reactive } from 'vue'
import { useCartStore } from '@/stores/cart'
import axios from 'axios'

const cart = useCartStore()

const form = reactive({
  name: '',
  address: '',
  phone: '',
  note: ''
})

async function submitOrder() {
  try {
    const payload = { ...form, items: cart.items }
    const res = await axios.post('http://localhost:3000/api/orders', payload)
    alert('✅ 訂單已送出！')
    cart.clearCart()
  } catch (err) {
    alert('❌ 訂單送出失敗，請稍後再試')
  }
}
</script>
