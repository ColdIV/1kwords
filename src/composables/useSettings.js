import { reactive, watch } from 'vue'

const STORAGE_KEY = '1kw_settings'

const defaults = {
  sourceLang: 'fr',
  newWordsPerDay: 10,
  uiLocale: 'en',
  endlessMode: false,
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults }
  } catch {
    return { ...defaults }
  }
}

const settings = reactive(load())

watch(settings, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

export function useSettings() {
  return { settings }
}
