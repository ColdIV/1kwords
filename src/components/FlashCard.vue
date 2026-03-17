<template>
  <div class="flashcard-container" @click="flip">
    <div class="flashcard" :class="{ flipped, resetting }">
      <div class="flashcard-face flashcard-front">
        <span class="card-word">{{ word.word }}</span>
        <span v-if="word.romanization" class="card-romanization">{{ word.romanization }}</span>
        <span class="card-hint">{{ $t('practice.tapToFlip') }}</span>
      </div>
      <div class="flashcard-face flashcard-back">
        <span class="card-translation">{{ word.translation }}</span>
        <span class="card-original">{{ word.word }}</span>
        <span v-if="word.romanization" class="card-romanization">{{ word.romanization }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  word: { type: Object, required: true },
})

const emit = defineEmits(['flipped'])
const flipped = ref(false)
const resetting = ref(false)

function flip() {
  flipped.value = !flipped.value
  if (flipped.value) emit('flipped')
}

watch(() => props.word, () => {
  resetting.value = true
  flipped.value = false
  requestAnimationFrame(() => {
    resetting.value = false
  })
})
</script>
