<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { getBingWallpaper, BingWallpaper } from '../api/bing'
import { useConfigStore } from '../stores/config'
import { storeToRefs } from 'pinia'

const configStore = useConfigStore()
const { layoutConfig } = storeToRefs(configStore)

const wallpaper = ref<BingWallpaper | null>(null)
const isLoading = ref(true)
let refreshInterval: number | null = null

const isWallpaperEnabled = computed(() => layoutConfig.value.enableWallpaper)
const refreshIntervalTime = computed(() => layoutConfig.value.wallpaperRefreshInterval * 60 * 1000)

async function fetchWallpaper() {
  if (!isWallpaperEnabled.value) return
  
  isLoading.value = true
  try {
    const result = await getBingWallpaper()
    wallpaper.value = result
  } catch (error) {
    console.error('Failed to fetch wallpaper:', error)
  } finally {
    isLoading.value = false
  }
}

function setupRefreshInterval() {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  
  if (isWallpaperEnabled.value) {
    refreshInterval = window.setInterval(fetchWallpaper, refreshIntervalTime.value)
  }
}

onMounted(() => {
  if (isWallpaperEnabled.value) {
    fetchWallpaper()
  }
  setupRefreshInterval()
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

// 监听配置变化
watch(isWallpaperEnabled, (newValue) => {
  if (newValue) {
    fetchWallpaper()
  }
  setupRefreshInterval()
})

watch(refreshIntervalTime, () => {
  setupRefreshInterval()
})
</script>

<template>
  <div class="wallpaper-view w-full h-full relative flex items-center justify-center">
    <div v-if="!isWallpaperEnabled" class="absolute inset-0 flex items-center justify-center bg-black">
      <div class="text-white text-xl">壁纸功能已禁用</div>
    </div>
    
    <div v-else-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black">
      <div class="text-white text-xl">加载中...</div>
    </div>
    
    <div v-else-if="wallpaper" class="relative w-full h-full">
      <img 
        :src="wallpaper.url" 
        :alt="wallpaper.title" 
        class="w-full h-full object-cover"
      />
      <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
        <div class="text-white text-lg font-medium">{{ wallpaper.title }}</div>
        <div class="text-white/80 text-sm mt-1">{{ wallpaper.copyright }}</div>
      </div>
    </div>
    
    <div v-else class="absolute inset-0 flex items-center justify-center bg-black">
      <div class="text-white text-xl">无法加载壁纸</div>
    </div>
  </div>
</template>

<style scoped>
.wallpaper-view {
  overflow: hidden;
}
</style>