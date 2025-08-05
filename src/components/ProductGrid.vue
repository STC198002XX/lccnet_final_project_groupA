<template>
  <section class="lattest-product-area pb-40 category-list">
    <!-- Filter Bar -->
    <div class="filter-bar mb-4 d-flex align-items-center gap-3">
      <!-- ✅ 寫死分類 -->
      <select v-model="selectedCategory" class="form-control w-auto">
        <option value="">全部分類</option>
        <option value="Candles">Candles</option>
        <option value="Diffusers">Diffusers</option>
        <option value="Room Spray">Room Spray</option>
        <option value="Body Care">Body Care</option>
        <option value="Perfumes">Perfumes</option>
        <option value="Kids">Kids</option>
      </select>

      <!-- 🔍 商品名稱搜尋 -->
      <input
        v-model="searchQuery"
        type="text"
        class="form-control"
        placeholder="輸入商品名稱"
      />
    </div>

    <!-- 商品卡片 -->
    <div class="row">
      <div
        class="col-md-6 col-lg-4"
        v-for="product in paginatedProducts"
        :key="product.product_id"
      >
        <div class="card text-center card-product">
          <router-link :to="`/product/${product.product_id}`" class="card text-center card-product">
            <div class="card-product__img">
              <img class="card-img" :src="product.image" :alt="product.name" />
            </div>
            <div class="card-body">
              <p>{{ product.category }}</p>
              <h4 class="card-product__title">{{ product.name }}</h4>
              <p class="card-product__price">${{ product.price }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 分頁按鈕 -->
    <div class="pagination mt-4 d-flex justify-content-center">
      <button
        v-for="page in totalPages"
        :key="page"
        class="btn btn-outline-dark mx-1"
        :class="{ active: currentPage === page }"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
    </div>
    <!-- <div class="row">
      <div class="col-md-6 col-lg-4" v-for="product in products" :key="product.id">
        <div class="card text-center card-product">
          <div class="card-product__img">
            <img v-if="product" class="card-img" :src="product.image" :alt="product.title">
          </div>
          <div class="card-body">
            <p>{{ product.category }}</p>
            <h4 class="card-product__title">
              <router-link :to="`/product/${product.product_id}`">{{ product.name }}</router-link>
            </h4>
            <p class="card-product__price">${{ product.price }}</p>
          </div>
        </div>
      </div>
    </div> -->
  </section>
</template>
  
<script>

  export default {
    name: 'ProductGrid',
    data() {
      return {
        products: [],
        selectedCategory: '',
        searchQuery: '',
        currentPage: 1,
        itemsPerPage: 9
      }
    },

    computed: {
    // Step 1: 篩選分類 & 商品名
    filteredProducts() {
      return this.products.filter(product => {
        const matchCategory =
          this.selectedCategory === '' ||
          product.category === this.selectedCategory
        const matchName = product.name
          .toString()
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
        return matchCategory && matchName
      })
    },

    // Step 2: 計算總頁數
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    },

    // Step 3: 擷取目前頁面該顯示的商品
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredProducts.slice(start, start + this.itemsPerPage)
    }
  },
  watch: {
    // 每當篩選條件改變，頁碼重置為第 1 頁
    selectedCategory() {
      this.currentPage = 1
    },
    searchQuery() {
      this.currentPage = 1
    }
  },
  
    mounted() {
      const API_URL = process.env.VUE_APP_API
      fetch(`${API_URL}/api/products`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          this.products = data
        })
        .catch(error => {
          console.error('無法載入商品資料:', error)
        })
    }
  }
</script>