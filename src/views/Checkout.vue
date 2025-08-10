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
import { reactive,ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth' // ✅ 新增
import axios from 'axios'
const API_URL = process.env.VUE_APP_API
const cart = useCartStore()
const auth = useAuthStore() // ✅ 使用登入資訊
const isSubmitting = ref(false)
const form = reactive({
  name: '',
  address: '',
  phone: '',
  note: ''
})

async function submitOrder() {
  if (!auth.user?.id) {
    alert('❌ 尚未登入，請先登入')
    return
  }
  if (cart.items.length === 0) {
    alert('購物車是空的')
    return
  }

  const payload = {
    user_id: auth.user.id,
    ...form, // 你的表單：name, address, phone, note...
    items: cart.items.map(it => ({ product_id: it.id, quantity: it.quantity }))
  }

  try {
    isSubmitting.value = true

    // 1) 建立訂單（後端同時檢查與扣庫存、清購物車）
    const { data: order } = await axios.post(`${API_URL}/api/orders`, payload)
    console.log('訂單資料:', order)

    // 2) 綠界表單
    const { data: payFormHtml } = await axios.post(`${API_URL}/api/ecpay-pay`, {
      amount: order.amount,
      desc: '訂單說明',
      itemName: '購物商品項目',
      orderNo: order.order_id
    })

    // 3) 重置本地購物車（後端已清，這裡只同步前端狀態）
    cart.items = []
    await cart.clearCart()

    // 4) 注入並送出綠界表單
    const formDiv = document.createElement('div')
    formDiv.innerHTML = payFormHtml
    document.body.appendChild(formDiv)
    formDiv.querySelector('form')?.submit()

  } catch (err) {
    // 後端回 409：庫存不足（附 shortages 明細）
    if (axios.isAxiosError(err) && err.response?.status === 409) {
      const shortages = err.response.data?.shortages || []
      const lines = shortages.map(s => {
        if (s.reason === 'NOT_FOUND') return `商品 ${s.product_id} 不存在`
        return `商品 ${s.product_id} 庫存 ${s.stock}，需求 ${s.requested}`
      })
      alert(`❌ 庫存不足，請調整數量：\n${lines.join('\n')}`)
      return
    }

    console.error(err)
    alert('❌ 訂單送出失敗，請稍後再試')
  } finally {
    isSubmitting.value = false
  }
}
</script>
