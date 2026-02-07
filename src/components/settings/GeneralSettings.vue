<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useConfigStore } from '../../stores/config'

const configStore = useConfigStore()
const { language, layoutConfig } = storeToRefs(configStore)
const { t } = useI18n()

const layoutDraft = ref({ ...layoutConfig.value })

function save() {
  // 验证自动返回首页时间
  if (layoutDraft.value.autoReturnHome) {
    const autoReturnTime = Number(layoutDraft.value.autoReturnHomeTime)
    if (isNaN(autoReturnTime) || autoReturnTime < 5 || autoReturnTime > 300) {
      layoutDraft.value.autoReturnHomeTime = 30 // 重置为默认值
    }
  }
  
  // 验证壁纸刷新间隔
  if (layoutDraft.value.enableWallpaper) {
    const wallpaperInterval = Number(layoutDraft.value.wallpaperRefreshInterval)
    if (isNaN(wallpaperInterval) || wallpaperInterval < 15 || wallpaperInterval > 1440) {
      layoutDraft.value.wallpaperRefreshInterval = 60 // 重置为默认值
    }
  }
  
  layoutConfig.value = { ...layoutDraft.value }
}

function reset() {
  layoutDraft.value = { ...layoutConfig.value }
}

defineExpose({ save, reset })
</script>

<template>
  <div class="space-y-10 animate-fade-in">
    <section>
      <h4 class="text-white/60 mb-4 uppercase tracking-widest text-sm font-medium">
        {{ t('language.label') }} (beta)
      </h4>
      <div class="grid grid-cols-3 space-x-3">
        <button
          class="settings-tab-btn"
          :class="{ active: language === 'zh-CN' }"
          @click="language = 'zh-CN'"
        >
          {{ t('language.zhCN') }}
        </button>
        <button
          class="settings-tab-btn"
          :class="{ active: language === 'zh-TW' }"
          @click="language = 'zh-TW'"
        >
          {{ t('language.zhTW') }}
        </button>
        <button
          class="settings-tab-btn"
          :class="{ active: language === 'en-US' }"
          @click="language = 'en-US'"
        >
          {{ t('language.enUS') }}
        </button>
      </div>
    </section>

    <section class="space-y-4">
      <h4 class="text-white/60 mb-4 uppercase tracking-widest text-sm font-medium">
        {{ t('generalSettings.layout') }}
      </h4>
      <div
        class="settings-toggle-card"
        :class="{ active: layoutDraft.clockOnlyMode }"
        @click="layoutDraft.clockOnlyMode = !layoutDraft.clockOnlyMode"
      >
        <span class="font-medium">{{ t('generalSettings.clockOnlyMode') }}</span>
        <div class="toggle-switch">
          <div class="toggle-dot" />
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h4 class="text-white/60 mb-4 uppercase tracking-widest text-sm font-medium">
        {{ t('generalSettings.autoReturn') }}
      </h4>
      <div
        class="settings-toggle-card"
        :class="{ active: layoutDraft.autoReturnHome }"
        @click="layoutDraft.autoReturnHome = !layoutDraft.autoReturnHome"
      >
        <span class="font-medium">{{ t('generalSettings.autoReturnHome') }}</span>
        <div class="toggle-switch">
          <div class="toggle-dot" />
        </div>
      </div>
      <div v-if="layoutDraft.autoReturnHome" class="settings-input-card">
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium">{{ t('generalSettings.autoReturnHomeTime') }}</span>
        </div>
        <div class="flex items-center">
          <input
            type="number"
            min="5"
            max="300"
            v-model.number="layoutDraft.autoReturnHomeTime"
            class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            @input=""
          />
          <span class="ml-3 text-white/60">秒</span>
        </div>
        <div class="text-xs text-white/40 mt-1">
          范围：5-300秒
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h4 class="text-white/60 mb-4 uppercase tracking-widest text-sm font-medium">
        {{ t('generalSettings.wallpaper') }}
      </h4>
      <div
        class="settings-toggle-card"
        :class="{ active: layoutDraft.enableWallpaper }"
        @click="layoutDraft.enableWallpaper = !layoutDraft.enableWallpaper"
      >
        <span class="font-medium">{{ t('generalSettings.enableWallpaper') }}</span>
        <div class="toggle-switch">
          <div class="toggle-dot" />
        </div>
      </div>
      <div v-if="layoutDraft.enableWallpaper" class="settings-input-card">
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium">{{ t('generalSettings.wallpaperRefreshInterval') }}</span>
        </div>
        <div class="flex items-center">
          <input
            type="number"
            min="15"
            max="1440"
            v-model.number="layoutDraft.wallpaperRefreshInterval"
            class="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            @input=""
          />
          <span class="ml-3 text-white/60">分钟</span>
        </div>
        <div class="text-xs text-white/40 mt-1">
          范围：15-1440分钟
        </div>
      </div>
    </section>
  </div>
</template>
