<template>
  <AppHeader />
  <main>
    <router-view :key="viewKey" />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSettings } from './composables/useSettings.js'
import AppHeader from './components/AppHeader.vue'

const route = useRoute()
const { settings } = useSettings()

const viewKey = computed(() => `${route.fullPath}-${settings.sourceLang}`)
</script>
