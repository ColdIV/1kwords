<template>
  <header class="app-header">
    <div class="header-left">
      <router-link to="/" class="logo">1kwords</router-link>
    </div>
    <nav class="header-nav" :class="{ open: menuOpen }">
      <router-link to="/" @click="menuOpen = false">{{ $t('nav.home') }}</router-link>
      <router-link to="/practice" @click="menuOpen = false">{{ $t('nav.practice') }}</router-link>
      <router-link to="/stats" @click="menuOpen = false">{{ $t('nav.stats') }}</router-link>
      <router-link to="/settings" @click="menuOpen = false">{{ $t('nav.settings') }}</router-link>
    </nav>
    <div class="header-right">
      <span v-if="streak > 0" class="streak" :title="$t('home.streak')">{{ streak }}d</span>
      <div class="lang-switcher" ref="switcherRef">
        <button class="lang-switcher-btn" @click.stop="toggleDropdown" :aria-label="$t('nav.settings')">
          {{ currentFlag }}
        </button>
        <div v-if="dropdownOpen" class="lang-dropdown">
          <button
            v-for="(lang, code) in languages"
            :key="code"
            class="lang-option"
            :class="{ active: code === settings.sourceLang }"
            @click="selectLang(code)"
          >
            <span class="lang-option-flag">{{ lang.flag }}</span>
            <span class="lang-option-name">{{ lang.name }}</span>
          </button>
        </div>
      </div>
      <button class="hamburger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useSettings } from '../composables/useSettings.js'
import { useStats } from '../composables/useStats.js'
import { languages } from '../data/languages.js'

const { settings } = useSettings()
const { getStreak } = useStats()

const dropdownOpen = ref(false)
const menuOpen = ref(false)
const switcherRef = ref(null)

const currentFlag = computed(() => {
  const lang = languages[settings.sourceLang]
  return lang ? lang.flag : ''
})

const streak = computed(() => getStreak(settings.sourceLang))

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function selectLang(code) {
  settings.sourceLang = code
  dropdownOpen.value = false
}

function onClickOutside(e) {
  if (switcherRef.value && !switcherRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
  if (!e.target.closest('.app-header')) {
    menuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>
