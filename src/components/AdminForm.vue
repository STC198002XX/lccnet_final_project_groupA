<template>
  <div>
    <h4>新增管理員</h4>
    <img src="aroma/img/login.jpg" alt="admin" class="img-thumbnail mb-2" style="width: 150px;">
    <form @submit.prevent="addAdmin">
      <div class="form-group">
        <label>帳號</label>
        <input v-model="newAdmin.username" type="text" class="form-control">
      </div>
      <div class="form-group">
        <label>密碼</label>
        <input v-model="newAdmin.password" type="password" class="form-control">
      </div>
      <div class="form-group">
        <label>權限</label>
        <select v-model="newAdmin.role" class="form-control">
          <option>一般管理員</option>
          <option>超級管理員</option>
        </select>
      </div>
      <button type="submit" class="btn btn-success">新增</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newAdmin = ref({ username: '', password: '', role: '一般管理員' })

function addAdmin() {
  alert(`新增管理員：${newAdmin.value.username}`)
}
</script>