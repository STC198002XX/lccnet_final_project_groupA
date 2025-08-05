<template>
  <div>
    <h4>會員資料與訂單</h4>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>會員ID</th>
          <th>姓名</th>
          <th>Email</th>
          <th>註冊時間</th>
          <!-- <th>頭像</th> -->
          <th>訂單</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.registered }}</td>
          <!-- <td><img src="aroma/img/r1.jpg" alt="avatar" style="height: 50px;"></td> --> 
          <td>
            <table class="table">
              <thead>
                <tr>
                  <th>訂單編號</th>
                  <th>金額</th>
                  <th>狀態</th>
                  <!-- <th>圖片</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in user.orders" :key="order.id">
                  <td>{{ order.id }}</td>
                  <td>{{ order.amount }}</td>
                  <td>{{ order.status }}</td>
                  <!-- <td><img src="aroma/img/r3.jpg" alt="product" style="height: 50px;"></td> -->
                </tr>
                <tr v-if="user.orders.length === 0">
                  <td colspan="3">無訂單</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'

const users = ref([])
const API_URL = process.env.VUE_APP_API
onMounted(async () => {
  const res = await fetch(`${API_URL}/api/users`)
  users.value = await res.json()
})
</script>
