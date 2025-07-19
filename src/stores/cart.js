// src/stores/cart.js
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] // 購物車內的商品資料：每筆 { id, name, price, quantity }
  }),
  persist: true, // ✅ 新增這行，啟用 localStorage 自動保存
  actions: {
    // 加入商品
    addItem(product) {
      const existing = this.items.find(p => p.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        this.items.push({ ...product })
      }
    },
    // 移除商品
    removeItem(id) {
      this.items = this.items.filter(p => p.id !== id)
    },
    // 更新商品數量
    updateQuantity(id, quantity) {
      const item = this.items.find(p => p.id === id)
      if (item) item.quantity = quantity
    },
    // 清空購物車
    clearCart() {
      this.items = []
    }
  },
  getters: {
    // 計算總金額
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
})
