<!-- 使用時需加註title及subtitle 如：<BannerProps title="Shop" subtitle="Shop"/> -->
<template>
  <section class="blog-banner-area">
    <div class="container h-100">
      <div class="row">
        <div class="blog-banner">
          <div class="text-center">
            <h1>{{ title }}</h1>
            <nav aria-label="breadcrumb" class="banner-breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <a href="/">首頁</a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  {{ subtitle }}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "BannerProps",
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped>
.banner {
  background: #f9f9f9;
  padding: 60px 0;
}
</style>