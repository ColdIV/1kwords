<template>
  <AppHeader />
  <main>
    <div v-if="currentLangLabel" class="current-language-banner">{{ currentLangLabel }}</div>
    <router-view :key="viewKey" />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSettings } from './composables/useSettings.js'
import AppHeader from './components/AppHeader.vue'
import { languages } from './data/languages.js'

const route = useRoute()
const { settings } = useSettings()

const viewKey = computed(() => `${route.fullPath}-${settings.sourceLang}`)

const currentLangLabel = computed(() => {
  const lang = languages[settings.sourceLang]
  return lang ? `Learning ${lang.name}` : ''
})
</script>
