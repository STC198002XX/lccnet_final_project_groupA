<template>
  <div ref="mapContainer" class="google-map"></div>
</template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  
  const mapContainer = ref(null)
  
  const props = defineProps({
    center: { type: Object, default: () => ({ lat: 25.092963, lng: 121.525757 }) }, // 聯成電腦-士林
    zoom: { type: Number, default: 15 },
    markerTitle: { type: String, default: '地標' }
  })
  
  onMounted(() => {
    // 等待 Google Map Script 載入完成
    if (!window.google || !window.google.maps) {
      console.error('Google Maps script 尚未載入')
      return
    }
  
    // 初始化地圖
    const map = new google.maps.Map(mapContainer.value, {
      center: props.center,
      zoom: props.zoom
    })
  
    // 加入標記
    new google.maps.Marker({
      position: props.center,
      map: map,
      title: props.markerTitle
    })
  })
  </script>
  
  <style scoped>
  .google-map {
    width: 100%;
    height: 400px;
    border-radius: 8px;
  }
  </style>