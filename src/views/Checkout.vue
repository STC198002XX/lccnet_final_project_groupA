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
import { useAuthStore } from '@/stores/auth' // ✅ 新增
import axios from 'axios'
const API_URL = process.env.VUE_APP_API
const cart = useCartStore()
const auth = useAuthStore() // ✅ 使用登入資訊

const form = reactive({
  name: '',
  address: '',
  phone: '',
  note: ''
})

async function submitOrder() {
  try {
    if (!auth.user?.id) {
      alert('❌ 尚未登入，請先登入')
      return
    }

    // 1. 建立訂單資料
    const payload = {
      user_id: auth.user.id, // ✅ 加入使用者 ID
      ...form,
      items: cart.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))
    }

    const orderRes = await axios.post(`${API_URL}/api/orders`, payload)
    const order = orderRes.data
    console.log('訂單資料:', order)
    // 2. 根據訂單內容建立綠界付款表單
    const ecpayRes = await axios.post(`${API_URL}/api/ecpay-pay`, {
      amount: order.amount, // 測試金額
      desc: '訂單說明',
      itemName: '購物商品項目',
      orderNo: order.order_id
    })
    
    // 3. 清空購物車
    cart.clearCart()

    // 4. 建立一個 <div> 塞進表單並觸發送出
    const formDiv = document.createElement('div')
    formDiv.innerHTML = ecpayRes.data
    document.body.appendChild(formDiv)
    formDiv.querySelector('form').submit()
  } catch (err) {
    alert('❌ 訂單送出失敗')
    console.error(err)

  //   alert('✅ 訂單已送出！')
  //   cart.clearCart()
  // } catch (err) {
  //   alert('❌ 訂單送出失敗，請稍後再試')
  //   console.error(err)
  // }
}}
</script>
