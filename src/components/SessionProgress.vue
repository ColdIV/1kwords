<template>
  <div class="session-progress">
    <div class="progress-text">
      {{ $t('practice.cardOf', { current: current, total: total }) }}
    </div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: percentage + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: { type: Number, required: true },
  total: { type: Number, required: true },
})

const percentage = computed(() => {
  if (props.total === 0) return 0
  return Math.round((props.current / props.total) * 100)
})
</script>
