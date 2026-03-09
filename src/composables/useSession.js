import { reactive, computed } from 'vue'
import { getToday } from '../utils/date.js'
import { useProgress } from './useProgress.js'
import { useWords } from './useWords.js'
import { useSettings } from './useSettings.js'

function storageKey(lang) {
  return `1kw_session_${lang}`
}

const session = reactive({
  date: null,
  queue: [],
  currentIndex: 0,
  results: [],
  active: false,
})

function loadSession(lang) {
  try {
    const raw = localStorage.getItem(storageKey(lang))
    if (!raw) return false
    const data = JSON.parse(raw)
    if (data.date !== getToday()) {
      localStorage.removeItem(storageKey(lang))
      return false
    }
    Object.assign(session, data, { active: true })
    return true
  } catch {
    return false
  }
}

function saveSession(lang) {
  localStorage.setItem(storageKey(lang), JSON.stringify({
    date: session.date,
    queue: session.queue,
    currentIndex: session.currentIndex,
    results: session.results,
  }))
}

function generateSession(lang) {
  const { getDueWords, getUnseenWords } = useProgress()
  const { words } = useWords()
  const { settings } = useSettings()

  const allIds = words.value.map((w) => w.id)
  const dueWords = getDueWords(lang, allIds)
  const unseenWords = getUnseenWords(lang, allIds)

  const maxReviews = settings.endlessMode ? Infinity : 40
  const maxTotal = settings.endlessMode ? Infinity : 50
  const newPerDay = settings.endlessMode ? Infinity : settings.newWordsPerDay

  const reviewIds = dueWords.slice(0, maxReviews).map((w) => w.id)
  const newIds = unseenWords.slice(0, newPerDay)

  const queue = []
  let ri = 0
  let ni = 0

  while (queue.length < maxTotal && (ri < reviewIds.length || ni < newIds.length)) {
    if (ri < reviewIds.length) queue.push({ id: reviewIds[ri++], isNew: false })
    if (ri < reviewIds.length && queue.length < maxTotal) queue.push({ id: reviewIds[ri++], isNew: false })
    if (ni < newIds.length && queue.length < maxTotal) queue.push({ id: newIds[ni++], isNew: true })
  }

  session.date = getToday()
  session.queue = queue
  session.currentIndex = 0
  session.results = []
  session.active = true

  saveSession(lang)
}

function startOrResumeSession(lang) {
  const resumed = loadSession(lang)
  if (!resumed) {
    generateSession(lang)
  }
  return session
}

function gradeCurrentCard(lang, correct) {
  const { gradeWord } = useProgress()
  const card = session.queue[session.currentIndex]
  if (!card) return

  gradeWord(lang, card.id, correct)
  session.results.push({ id: card.id, correct, isNew: card.isNew })
  session.currentIndex++
  saveSession(lang)
}

function clearSession(lang) {
  localStorage.removeItem(storageKey(lang))
  session.active = false
  session.queue = []
  session.currentIndex = 0
  session.results = []
  session.date = null
}

const isComplete = computed(() => {
  return session.active && session.currentIndex >= session.queue.length
})

const currentCard = computed(() => {
  if (!session.active || session.currentIndex >= session.queue.length) return null
  return session.queue[session.currentIndex]
})

const totalCards = computed(() => session.queue.length)
const cardsRemaining = computed(() => session.queue.length - session.currentIndex)

export function useSession() {
  return {
    session,
    startOrResumeSession,
    gradeCurrentCard,
    clearSession,
    isComplete,
    currentCard,
    totalCards,
    cardsRemaining,
  }
}
