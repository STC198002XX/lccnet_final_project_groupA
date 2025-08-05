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
          <th>圖片</th> <!-- 新增圖片欄 -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.product_id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.stock }}</td>
          <td>{{ product.price }}</td>
          <td>
      <img :src="product.image" alt="商品圖片" style="height: 80px;" />
    </td>
          
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'

const products = ref([])

onMounted(async () => {
  const API_URL = process.env.VUE_APP_API
  const res = await fetch(`${API_URL}/api/products`)
  products.value = await res.json()
})
</script>
