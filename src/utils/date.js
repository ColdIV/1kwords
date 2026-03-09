export function getToday() {
  return new Date().toISOString().split('T')[0]
}

export function addDays(dateStr, days) {
  const date = new Date(dateStr + 'T00:00:00')
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

export function subtractDays(dateStr, days) {
  return addDays(dateStr, -days)
}
