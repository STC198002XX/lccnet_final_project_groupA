<template>
  <div>
    <h4>商品庫存查詢</h4>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>商品編號</th>
          <th>名稱</th>
          <th>分類</th>
          <th>庫存</th>
          <th>價格</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.stock }}</td>
          <td>{{ product.price }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const products = ref([
  { id: 'P1001', name: 'iPhone 15', category: '手機', stock: 12, price: 34900 },
  { id: 'P1002', name: 'MacBook Pro', category: '筆電', stock: 7, price: 59900 }
])
</script>
