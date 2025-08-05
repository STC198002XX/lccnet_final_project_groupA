// src/stores/cart.js
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
const API_URL = process.env.VUE_APP_API
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] // 購物車內的商品資料：每筆 { id, name, price, quantity }
  }),
  actions: {
    
   
    // 清空購物車
    async clearCart() {
    const auth = useAuthStore()
    this.items = []
    if (auth.user?.id) {
      await fetch(`${API_URL}/api/cart/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: auth.user.id })
      })
    }},

    // 加入商品
    async addItem(product) {
      const existing = this.items.find(p => p.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
      console.log('目前購物車：', JSON.stringify(this.items))

      const auth = useAuthStore()
      if (auth.user?.id) {
        await fetch('${API_URL}/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: auth.user.id,
            product_id: product.id,
            quantity: 1
          })
        })
      }
    },

  // 個別商品加入
  async individualaddItem(product) {
    const existing = this.items.find(p => p.id === product.id)
    if (existing) {
      existing.quantity += product.quantity
    } else {
      this.items.push({ ...product, quantity: product.quantity})
    }
    console.log('目前購物車：', JSON.stringify(this.items))
    const auth = useAuthStore()
    if (auth.user?.id) {
      await fetch('${API_URL}/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: auth.user.id,
          product_id: product.id,
          quantity: product.quantity
        })
      })
    }
  },


// 更新商品數量
  async updateQuantity(id, quantity) {
    const item = this.items.find(p => p.id === id)
    if (item) item.quantity = quantity

    const auth = useAuthStore()
    if (auth.user?.id) {
      await fetch('${API_URL}/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: auth.user.id,
          product_id: id,
          quantity
        })
      })
    }
  },
 // 移除商品
  async removeItem(id) {
    this.items = this.items.filter(p => p.id !== id)

    const auth = useAuthStore()
    if (auth.user?.id) {
      await fetch('${API_URL}/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: auth.user.id,
          product_id: id,
          quantity: 0
        })
      })
    }},

  // 從伺服器載入購物車資料
  async loadFromServer(user_id) {
    try {
      const res = await fetch(`${API_URL}/api/cart?user_id=${user_id}`)
      const cartData = await res.json()

    const productRes = await fetch('${API_URL}/api/products')
    const products = await productRes.json()

    this.items = Array.isArray(cartData.items)
      ? cartData.items.map(i => {
          const product = products.find(p => p.product_id === i.product_id)
          return {
            id: i.product_id,
            name: product?.name || '',
            price: product?.price || 0,
            image: product?.image || '',
            quantity: i.quantity
          }
        })
      : []
    } catch (err) {
      console.error('❌ 載入購物車失敗', err)
      this.items = []
    }
  }},

  getters: {
    // 計算總金額
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),

    totalQuantity: (state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  },
  persist: true // ✅ 設定在這裡
})
