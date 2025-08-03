// src/stores/cart.js
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] // 購物車內的商品資料：每筆 { id, name, price, quantity }
  }),
  persist: true, // ✅ 新增這行，啟用 localStorage 自動保存
  actions: {
    
   
    // 清空購物車
    clearCart() {
      this.items = []
    },
    // 加入商品
  async addItem(product) {
    const existing = this.items.find(p => p.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      this.items.push({ ...product, quantity: 1 })
    }

    const auth = useAuthStore()
    if (auth.user?.id) {
      await fetch('http://localhost:3000/api/cart', {
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
// 更新商品數量
  async updateQuantity(id, quantity) {
    const item = this.items.find(p => p.id === id)
    if (item) item.quantity = quantity

    const auth = useAuthStore()
    if (auth.user?.id) {
      await fetch('http://localhost:3000/api/cart', {
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
      await fetch('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: auth.user.id,
          product_id: id,
          quantity: 0
        })
      })
    }
  },
    // 從伺服器載入購物車資料
  async loadFromServer(user_id) {
    try {
      const res = await fetch(`http://localhost:3000/api/cart?user_id=${user_id}`)
      const cartData = await res.json()

    const productRes = await fetch('http://localhost:3000/api/products')
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
  }


  },
  getters: {
    // 計算總金額
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
})
