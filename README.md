# 1kwords

A Vue 3 PWA for learning the 1000 most common words in French, Spanish, Korean, and Indonesian through spaced repetition flashcards.

## Local development

**Prerequisites:** Node.js 18+ or Bun

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build
```

## Adding a new language

1. Create a word data file at `src/data/words/<code>.json` (e.g. `pt.json` for Portuguese). The file should be a JSON array of objects:

```json
[
  {
    "id": 1,
    "word": "o",
    "translation": "the",
    "pos": "det",
    "example": "O gato está aqui."
  }
]
```

Each entry needs: `id` (sequential integer), `word` (target language), `translation` (English), `pos` (part of speech: noun, verb, adj, adv, det, prep, conj, pron, num, interj), and `example` (a sentence using the word).

2. Register the language in `src/data/languages.js`:

```js
export const languages = {
  // ...existing languages
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
}
```

## Updating word data

Edit the JSON file in `src/data/words/` directly. Keep IDs sequential and ensure no duplicate words exist in the same file.

## Adding UI translations

Edit `src/i18n.js` and add a new locale object following the structure of the existing `en` or `fr` entries. The locale key should match a language code users might set as their interface language.
