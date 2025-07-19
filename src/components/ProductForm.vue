<template>
  <div>
    <h4>商品上架</h4>
    <img src="aroma/img/r2.jpg" alt="preview" class="img-thumbnail mb-2" style="width: 150px;">
    <form @submit.prevent="addProduct">
      <div class="form-group">
        <label>商品名稱</label>
        <input v-model="newProduct.name" type="text" class="form-control">
      </div>
      <div class="form-group">
        <label>分類</label>
        <input v-model="newProduct.category" type="text" class="form-control">
      </div>
      <div class="form-group">
        <label>價格</label>
        <input v-model="newProduct.price" type="number" class="form-control">
      </div>
      <div class="form-group">
        <label>上傳圖片</label>
        <input type="file" class="form-control-file">
      </div>
      <button type="submit" class="btn btn-primary">送出</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newProduct = ref({ name: '', category: '', price: 0 })

function addProduct() {
  alert(`已上架商品：${newProduct.value.name}`)
}
</script>