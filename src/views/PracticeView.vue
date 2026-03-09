<template>
  <div class="practice-view">
    <template v-if="loading">
      <p>{{ $t('practice.loading') }}</p>
    </template>

    <template v-else-if="isComplete || !currentCard">
      <p>{{ $t('practice.sessionComplete') }}</p>
      <router-link to="/summary" class="btn-primary">{{ $t('practice.viewSummary') }}</router-link>
    </template>

    <template v-else>
      <span v-if="settings.endlessMode" class="endless-badge">{{ $t('practice.endlessMode') }}</span>
      <SessionProgress
        :current="session.currentIndex + 1"
        :total="totalCards"
      />

      <div v-if="currentWord" class="card-area">
        <span v-if="currentCard.isNew" class="badge-new">{{ $t('practice.newWord') }}</span>
        <FlashCard :word="currentWord" @flipped="showButtons = true" />
      </div>

      <GradeButtons
        v-if="showButtons"
        @grade="onGrade"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSettings } from '../composables/useSettings.js'
import { useWords } from '../composables/useWords.js'
import { useSession } from '../composables/useSession.js'
import { useStats } from '../composables/useStats.js'
import FlashCard from '../components/FlashCard.vue'
import SessionProgress from '../components/SessionProgress.vue'
import GradeButtons from '../components/GradeButtons.vue'

const router = useRouter()
const { settings } = useSettings()
const { loadWords, getWord } = useWords()
const { session, startOrResumeSession, gradeCurrentCard, isComplete, currentCard, totalCards, clearSession } = useSession()
const { recordSessionResults } = useStats()

const loading = ref(true)
const showButtons = ref(false)

const currentWord = computed(() => {
  if (!currentCard.value) return null
  return getWord(currentCard.value.id)
})

watch(currentCard, () => {
  showButtons.value = false
})

watch(isComplete, (done) => {
  if (done) {
    const lang = settings.sourceLang
    recordSessionResults(lang, session.results)
    router.push('/summary')
  }
})

function onGrade(correct) {
  gradeCurrentCard(settings.sourceLang, correct)
}

onMounted(async () => {
  const lang = settings.sourceLang
  await loadWords(lang)
  startOrResumeSession(lang)
  loading.value = false
})
</script>
