import { reactive } from 'vue'
import { getToday, addDays } from '../utils/date.js'

const BOX_INTERVALS = [0, 1, 3, 7, 14, 30]
const progressCache = {}

function storageKey(lang) {
  return `1kw_progress_${lang}`
}

function loadProgress(lang) {
  if (progressCache[lang]) return progressCache[lang]
  try {
    const raw = localStorage.getItem(storageKey(lang))
    const data = raw ? JSON.parse(raw) : {}
    progressCache[lang] = reactive(data)
    return progressCache[lang]
  } catch {
    progressCache[lang] = reactive({})
    return progressCache[lang]
  }
}

function saveProgress(lang) {
  const data = progressCache[lang]
  if (data) {
    localStorage.setItem(storageKey(lang), JSON.stringify(data))
  }
}

function getWordProgress(lang, wordId) {
  const progress = loadProgress(lang)
  return progress[wordId] || null
}

function gradeWord(lang, wordId, correct) {
  const progress = loadProgress(lang)
  const today = getToday()
  const current = progress[wordId] || { box: 0, correct: 0, incorrect: 0, lastSeen: null, nextDue: today }

  let newBox
  if (correct) {
    newBox = Math.min(current.box + 1, 5)
    current.correct++
  } else {
    newBox = Math.max(current.box - 1, 1)
    current.incorrect++
  }

  current.box = newBox
  current.lastSeen = today
  current.nextDue = addDays(today, BOX_INTERVALS[newBox])

  progress[wordId] = current
  saveProgress(lang)
}

function getDueWords(lang, allWordIds) {
  const progress = loadProgress(lang)
  const today = getToday()
  const due = []

  for (const id of allWordIds) {
    const p = progress[id]
    if (p && p.box >= 1 && p.nextDue <= today) {
      due.push({ id, ...p })
    }
  }

  due.sort((a, b) => {
    if (a.box !== b.box) return a.box - b.box
    return (a.lastSeen || '') < (b.lastSeen || '') ? -1 : 1
  })

  return due
}

function getUnseenWords(lang, allWordIds) {
  const progress = loadProgress(lang)
  return allWordIds.filter((id) => !progress[id] || progress[id].box === 0)
}

function getBoxDistribution(lang) {
  const progress = loadProgress(lang)
  const dist = [0, 0, 0, 0, 0, 0]
  for (const id in progress) {
    const box = progress[id].box
    if (box >= 0 && box <= 5) dist[box]++
  }
  return dist
}

function getTotalLearned(lang) {
  const progress = loadProgress(lang)
  let count = 0
  for (const id in progress) {
    if (progress[id].box >= 1) count++
  }
  return count
}

export function useProgress() {
  return {
    loadProgress,
    saveProgress,
    getWordProgress,
    gradeWord,
    getDueWords,
    getUnseenWords,
    getBoxDistribution,
    getTotalLearned,
    BOX_INTERVALS,
  }
}
