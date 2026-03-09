import { ref, shallowRef } from 'vue'

const cache = {}
const words = shallowRef([])
const wordMap = ref({})
const loaded = ref(false)

async function loadWords(lang) {
  if (cache[lang]) {
    words.value = cache[lang]
  } else {
    const module = await import(`../data/words/${lang}.json`)
    cache[lang] = module.default
    words.value = module.default
  }
  const map = {}
  for (const w of words.value) {
    map[w.id] = w
  }
  wordMap.value = map
  loaded.value = true
}

function getWord(id) {
  return wordMap.value[id] || null
}

export function useWords() {
  return { words, wordMap, loaded, loadWords, getWord }
}
