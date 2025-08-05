<template>
  <div>
    <a class="navbar-brand logo_h"><router-link to="/"><img src="/aroma/img/logo.png" alt=""></router-link></a>
    <button class="btn btn-danger mb-3" @click="handleLogout">登出</button>
    <h4>會員資料</h4>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>姓名</th>
          <th>Email</th>
          <th>註冊時間</th>
          <th>頭像</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="token && user">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.registered }}</td>
          <td><img src="aroma/img/r1.jpg" alt="avatar" style="height: 50px;"></td>
        </tr>
        <tr v-else>
          <td colspan="5">尚未登入</td>
        </tr>
      </tbody>
    </table>
  </div>
  <h4>購買紀錄</h4>
  <table class="table table-bordered" v-if="orders.length">
    <thead>
      <tr>
        <th>訂單編號</th>
        <th>金額</th>
        <th>狀態</th>
        <th>日期</th>
        <th>商品明細</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.order_id">
        <td>{{ order.order_id }}</td>
        <td>${{ order.amount }}</td>
        <td>{{ order.status }}</td>
        <td>{{ new Date(order.created_at).toLocaleString() }}</td>
        <td>
          <ul>
            <li v-for="item in order.items" :key="item.product_id">
              {{ item.product_id }} × {{ item.quantity }}（單價: ${{ item.price }}）
            </li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
  <p v-else>尚無購買紀錄</p>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()
const orders = ref([])

const handleLogout = () => {
  auth.logout()
  cart.clearCart()
  router.push('/')
}

const user = computed(() => auth.user)
const token = computed(() => auth.token)

onMounted(async () => {
  if (auth.user?.id) {
    const res = await fetch(`http://localhost:3000/api/orders/${auth.user.id}`)
    orders.value = await res.json()
  }
})
</script>
