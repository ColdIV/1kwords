<template>
  <div class="home-view">
    <h1>{{ $t('home.title') }}</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-value">{{ totalLearned }}</span>
        <span class="stat-label">{{ $t('home.wordsLearned') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ streak }}</span>
        <span class="stat-label">{{ $t('home.streak') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ todayReviewed }}</span>
        <span class="stat-label">{{ $t('home.todayReviewed') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ dueCount }}</span>
        <span class="stat-label">{{ $t('home.dueForReview') }}</span>
      </div>
    </div>

    <p v-if="settings.endlessMode" class="endless-indicator">{{ $t('home.endlessModeActive') }}</p>

    <router-link to="/practice" class="btn-primary btn-start">
      {{ hasActiveSession ? $t('home.continueSession') : $t('home.startPractice') }}
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettings } from '../composables/useSettings.js'
import { useWords } from '../composables/useWords.js'
import { useProgress } from '../composables/useProgress.js'
import { useStats } from '../composables/useStats.js'
import { getToday } from '../utils/date.js'

const { settings } = useSettings()
const { words, loadWords } = useWords()
const { getTotalLearned, getDueWords } = useProgress()
const { getStreak, getDayStats } = useStats()

const totalLearned = ref(0)
const streak = ref(0)
const todayReviewed = ref(0)
const dueCount = ref(0)
const hasActiveSession = ref(false)

onMounted(async () => {
  const lang = settings.sourceLang
  await loadWords(lang)

  totalLearned.value = getTotalLearned(lang)
  streak.value = getStreak(lang)

  const todayStats = getDayStats(lang, getToday())
  todayReviewed.value = todayStats.reviewed

  const allIds = words.value.map((w) => w.id)
  dueCount.value = getDueWords(lang, allIds).length

  const sessionData = localStorage.getItem(`1kw_session_${lang}`)
  if (sessionData) {
    try {
      const s = JSON.parse(sessionData)
      hasActiveSession.value = s.date === getToday() && s.currentIndex < s.queue.length
    } catch { /* ignore */ }
  }
})
</script>
