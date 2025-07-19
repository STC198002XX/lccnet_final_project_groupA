<template>
  <div>
    <h4>會員資料</h4>
    <table class="table table-bordered">
      <thead>
        <tr><th>ID</th><th>姓名</th><th>Email</th><th>註冊時間</th><th>頭像</th></tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.registered }}</td>
          <td><img src="aroma/img/r1.jpg" alt="avatar" style="height: 50px;"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, name: '王小明', email: 'ming@example.com', registered: '2025-07-01' }
])
</script>