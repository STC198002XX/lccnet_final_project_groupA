<template>
  <div>
    <h4>商品上架</h4>
   
    <form @submit.prevent="addProduct">
      <div class="form-group">
        <label>商品名稱</label>
         <input v-model="newProduct.name" type="text" class="form-control" required>
      </div>
      <div class="form-group">
        <label>分類</label>
         <input v-model="newProduct.category" type="text" class="form-control" required>
      </div>
      <div class="form-group">
        <label>價格</label>
        <input v-model.number="newProduct.price" type="number" class="form-control" required>

      </div>

      <div class="form-group">

        <label>庫存數量</label>

        <input v-model.number="newProduct.stock" type="number" class="form-control" required>
      </div>
      <div class="form-group">
        <label>上傳圖片</label>
        <input type="file" class="form-control-file" @change="onFileChange" required>
      </div>
      <button type="submit" class="btn btn-primary">送出</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const API_URL = process.env.VUE_APP_API

const newProduct = ref({
  name: '',
  category: '',
  price: 0,
  stock: 0
})

const imageFile = ref(null)
function onFileChange(e) {
  imageFile.value = e.target.files[0]
}



async function addProduct() {
  const formData = new FormData()
  for (const key in newProduct.value) {
    formData.append(key, newProduct.value[key])
  }
  formData.append('image', imageFile.value)
  const res = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    body: formData
  })
  const result = await res.json()
  alert(result.message)
}
</script>