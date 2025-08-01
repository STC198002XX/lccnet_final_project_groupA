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
</template>


<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()

const handleLogout = () => {
  auth.logout()
  cart.clearCart()
  router.push('/')
}

const user = computed(() => auth.user)
const token = computed(() => auth.token)

import { onMounted } from 'vue'

onMounted(() => {
  console.log('auth.token', auth.token)
  console.log('auth.user', auth.user)
})
</script>
