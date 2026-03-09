import { getToday, subtractDays } from '../utils/date.js'

function storageKey(lang) {
  return `1kw_stats_${lang}`
}

function loadStats(lang) {
  try {
    const raw = localStorage.getItem(storageKey(lang))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveStats(lang, stats) {
  localStorage.setItem(storageKey(lang), JSON.stringify(stats))
}

function recordSessionResults(lang, results) {
  const stats = loadStats(lang)
  const today = getToday()

  if (!stats[today]) {
    stats[today] = { reviewed: 0, correct: 0, incorrect: 0, newLearned: 0 }
  }

  const day = stats[today]
  for (const r of results) {
    day.reviewed++
    if (r.correct) day.correct++
    else day.incorrect++
    if (r.isNew) day.newLearned++
  }

  saveStats(lang, stats)
}

function getDayStats(lang, dateStr) {
  const stats = loadStats(lang)
  return stats[dateStr] || { reviewed: 0, correct: 0, incorrect: 0, newLearned: 0 }
}

function getLast7Days(lang) {
  const today = getToday()
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = subtractDays(today, i)
    const stats = getDayStats(lang, date)
    days.push({ date, ...stats })
  }
  return days
}

function getStreak(lang) {
  const stats = loadStats(lang)
  const today = getToday()
  let streak = 0
  let date = today

  while (true) {
    const day = stats[date]
    if (day && day.reviewed > 0) {
      streak++
      date = subtractDays(date, 1)
    } else {
      break
    }
  }

  return streak
}

function getTotalReviewed(lang) {
  const stats = loadStats(lang)
  let total = 0
  for (const date in stats) {
    total += stats[date].reviewed
  }
  return total
}

export function useStats() {
  return {
    recordSessionResults,
    getDayStats,
    getLast7Days,
    getStreak,
    getTotalReviewed,
  }
}
