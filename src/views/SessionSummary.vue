<template>
  <div class="summary-view">
    <h1>{{ $t('summary.title') }}</h1>

    <div class="summary-stats">
      <div class="stat-card large">
        <span class="stat-value">{{ accuracy }}%</span>
        <span class="stat-label">{{ $t('summary.accuracy') }}</span>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-value">{{ totalReviewed }}</span>
        <span class="stat-label">{{ $t('summary.cardsReviewed') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ correctCount }}</span>
        <span class="stat-label">{{ $t('summary.correct') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ incorrectCount }}</span>
        <span class="stat-label">{{ $t('summary.incorrect') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ newLearned }}</span>
        <span class="stat-label">{{ $t('summary.newWords') }}</span>
      </div>
    </div>

    <div v-if="missedWords.length > 0" class="missed-list">
      <h2>{{ $t('summary.missedWords') }}</h2>
      <div v-for="w in missedWords" :key="w.id" class="missed-word">
        <strong>{{ w.word }}</strong>
        <span v-if="w.romanization" class="missed-romanization">({{ w.romanization }})</span>
        — {{ w.translation }}
      </div>
    </div>

    <div class="summary-actions">
      <router-link to="/" class="btn-primary" @click="finishSession">{{ $t('summary.backHome') }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettings } from '../composables/useSettings.js'
import { useSession } from '../composables/useSession.js'
import { useWords } from '../composables/useWords.js'

const { settings } = useSettings()
const { session, clearSession } = useSession()
const { getWord } = useWords()

const results = computed(() => session.results || [])

const totalReviewed = computed(() => results.value.length)
const correctCount = computed(() => results.value.filter((r) => r.correct).length)
const incorrectCount = computed(() => results.value.filter((r) => !r.correct).length)
const newLearned = computed(() => results.value.filter((r) => r.isNew).length)

const accuracy = computed(() => {
  if (totalReviewed.value === 0) return 0
  return Math.round((correctCount.value / totalReviewed.value) * 100)
})

const missedWords = computed(() => {
  return results.value
    .filter((r) => !r.correct)
    .map((r) => getWord(r.id))
    .filter(Boolean)
})

function finishSession() {
  clearSession(settings.sourceLang)
}
</script>
