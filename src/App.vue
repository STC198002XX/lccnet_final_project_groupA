<template>
  <router-view />
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const auth = useAuthStore()
const cart = useCartStore()

onMounted(() => {
  auth.initFromLocal()

  // 若登入狀態存在，則載入購物車
  if (auth.user?.id) {
    cart.loadFromServer(auth.user.id)
  }
})

// 也可以加個監聽，當登入成功後再載入
watch(
  () => auth.user?.id,
  (newId) => {
    if (newId) cart.loadFromServer(newId)
  }
)

</script>
