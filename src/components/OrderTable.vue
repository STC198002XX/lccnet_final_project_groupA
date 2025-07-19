<template>
  <div>
    <h4>所有訂單</h4>
    <table class="table table-bordered">
      <thead>
        <tr><th>訂單編號</th><th>會員</th><th>金額</th><th>狀態</th><th>圖片</th></tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.user }}</td>
          <td>{{ order.amount }}</td>
          <td>{{ order.status }}</td>
          <td><img src="aroma/img/r3.jpg" alt="product" style="height: 50px;"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const orders = ref([
  { id: '#1001', user: '王小明', amount: '$500', status: '已出貨' }
])
</script>