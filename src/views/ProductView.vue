<template>
  <div>
    <!-- Header Area -->
    <Header />
    <!-- Banner -->
    <BannerProps title="Product" subtitle="Home - Product"/>
  
    <!-- Product -->
    <div class="product_image_area">
    <div class="container">
      <div class="row s_product_inner">
        <div class="col-lg-6">
          <div class="owl-theme s_Product_carousel">
            <div class="single-prd-item">
              <img v-if="product?.image" class="img-fluid" :src="product.image" :alt="product.name"/>
            </div>
          </div>
        </div>
        <div class="col-lg-5 offset-lg-1">
          <div class="s_product_text" v-if="product">
            <h3>{{ product.name }}</h3>
            <h2>${{ product.price }}</h2>
            <ul class="list">
              <li><span>Category</span> : {{ product.category }}</li>
              <li><span>Availibility</span> : {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}</li>
            </ul>
            <div class="product_count" v-if="product">
              <label for="qty">Quantity:</label>
              <div class="input-group" style="width: 150px;">
                <!-- <div class="input-group-prepend">
                  <button @click="decreaseQty" class="btn btn-outline-secondary" type="button">
                    <i class="ti-angle-left"></i>
                  </button>
                </div> -->
                <input type="number" class="form-control text-center" v-model.number="quantity" min="1">
                <!-- <div class="input-group-append">
                  <button @click="increaseQty" class="btn btn-outline-secondary" type="button">
                    <i class="ti-angle-right"></i>
                  </button>
                </div> -->
              </div>
              <button class="button primary-btn" @click="addToCart">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
      
  <!-- Footer -->
  <footer class="footer mt-5">
    <div class="footer-area">
      <div class="container">
        <p class="text-center pt-5">© 2025 Aroma Shop. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useCartStore } from '@/stores/cart'
  import Header from '@/components/Header.vue'
  import BannerProps from '../components/BannerProps.vue'
  
  const route = useRoute()
  const cart = useCartStore()
  
  const quantity = ref(1)
  const product = ref({})
  
  const increaseQty = () => {
    quantity.value++
  }
  
  const decreaseQty = () => {
    if (quantity.value > 1) quantity.value--
  }
  
  const addToCart = () => {
    if (!product.value) return
    cart.addItem(product.value, quantity.value)
    alert('商品已加入購物車！')
  }
  
  onMounted(async () => {
    const id = route.params.id
    const res = await fetch(`http://localhost:3000/api/products/${id}`)
    const data = await res.json()
    product.value = {
      id: data.product_id,
      name: data.name,
      price: data.price,
      image: data.image,
      category: data.category,
      stock: data.stock ?? 10 // 假設後端沒傳 stock 就預設 10
    }
  })
</script>