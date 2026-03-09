<template>
  <div class="stats-view">
    <h1>{{ $t('stats.title') }}</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-value">{{ totalLearned }}</span>
        <span class="stat-label">{{ $t('stats.totalLearned') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ totalReviewed }}</span>
        <span class="stat-label">{{ $t('stats.totalReviewed') }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ streak }}</span>
        <span class="stat-label">{{ $t('stats.streak') }}</span>
      </div>
    </div>

    <section class="stats-section">
      <h2>{{ $t('stats.boxDistribution') }}</h2>
      <div class="box-chart">
        <div v-for="(count, box) in boxDist" :key="box" class="box-bar-group">
          <div class="box-bar-container">
            <div class="box-bar" :style="{ height: barHeight(count) + '%' }"></div>
          </div>
          <span class="box-label">{{ box }}</span>
          <span class="box-count">{{ count }}</span>
        </div>
      </div>
    </section>

    <section class="stats-section">
      <h2>{{ $t('stats.last7Days') }}</h2>
      <div class="weekly-chart">
        <div v-for="day in last7" :key="day.date" class="day-col">
          <div class="day-bars">
            <div class="day-bar correct" :style="{ height: dayBarHeight(day.correct) + 'px' }"></div>
            <div class="day-bar incorrect" :style="{ height: dayBarHeight(day.incorrect) + 'px' }"></div>
          </div>
          <span class="day-label">{{ formatDay(day.date) }}</span>
        </div>
      </div>
      <div class="chart-legend">
        <span class="legend-item"><span class="legend-dot correct"></span> {{ $t('stats.correct') }}</span>
        <span class="legend-item"><span class="legend-dot incorrect"></span> {{ $t('stats.incorrect') }}</span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettings } from '../composables/useSettings.js'
import { useProgress } from '../composables/useProgress.js'
import { useStats } from '../composables/useStats.js'

const { settings } = useSettings()
const { getBoxDistribution, getTotalLearned } = useProgress()
const { getStreak, getTotalReviewed, getLast7Days } = useStats()

const totalLearned = ref(0)
const totalReviewed = ref(0)
const streak = ref(0)
const boxDist = ref([0, 0, 0, 0, 0, 0])
const last7 = ref([])

onMounted(() => {
  const lang = settings.sourceLang
  totalLearned.value = getTotalLearned(lang)
  totalReviewed.value = getTotalReviewed(lang)
  streak.value = getStreak(lang)
  boxDist.value = getBoxDistribution(lang)
  last7.value = getLast7Days(lang)
})

function barHeight(count) {
  const max = Math.max(...boxDist.value, 1)
  return Math.round((count / max) * 100)
}

function dayBarHeight(count) {
  const max = Math.max(...last7.value.map((d) => d.correct + d.incorrect), 1)
  return Math.round((count / max) * 80)
}

function formatDay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(undefined, { weekday: 'short' })
}
</script>
