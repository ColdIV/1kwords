<template>
  <div class="settings-view">
    <h1>{{ $t('settings.title') }}</h1>

    <div class="settings-group">
      <label class="setting-label">{{ $t('settings.language') }}</label>
      <select v-model="settings.sourceLang" class="setting-input">
        <option v-for="(lang, code) in languages" :key="code" :value="code">
          {{ lang.flag }} {{ lang.name }} ({{ lang.nativeName }})
        </option>
      </select>
    </div>

    <div class="settings-group">
      <label class="setting-label" :class="{ disabled: settings.endlessMode }">{{ $t('settings.newWordsPerDay') }}</label>
      <input
        v-model.number="settings.newWordsPerDay"
        type="number"
        min="1"
        max="50"
        class="setting-input"
        :disabled="settings.endlessMode"
      />
    </div>

    <div class="settings-group">
      <label class="setting-label">{{ $t('settings.endlessMode') }}</label>
      <div class="toggle-row">
        <label class="toggle">
          <input type="checkbox" v-model="settings.endlessMode" />
          <span class="toggle-slider"></span>
        </label>
        <span class="toggle-description">{{ $t('settings.endlessModeDescription') }}</span>
      </div>
    </div>

    <div class="settings-group">
      <label class="setting-label">{{ $t('settings.uiLanguage') }}</label>
      <select v-model="settings.uiLocale" class="setting-input" @change="changeLocale">
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
      </select>
    </div>

    <div class="settings-group">
      <label class="setting-label">Data</label>
      <div class="data-actions">
        <button class="btn-primary" @click="handleExport">Export Data</button>
        <button class="btn-primary btn-import" @click="triggerImport">Import Data</button>
        <input type="file" ref="fileInput" accept=".json" hidden @change="handleImport" />
      </div>
    </div>

    <div class="settings-group danger-zone">
      <h2>{{ $t('settings.dangerZone') }}</h2>
      <button class="btn-danger" @click="resetProgress">
        {{ $t('settings.resetProgress') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettings } from '../composables/useSettings.js'
import { useDataTransfer } from '../composables/useDataTransfer.js'
import { languages } from '../data/languages.js'

const { locale } = useI18n()
const { settings } = useSettings()
const { exportAllData, importAllData } = useDataTransfer()
const fileInput = ref(null)

function handleExport() {
  exportAllData()
}

function triggerImport() {
  fileInput.value.click()
}

async function handleImport(event) {
  const file = event.target.files[0]
  if (!file) return
  const result = await importAllData(file)
  if (result.success) {
    alert('Data imported successfully. The page will reload.')
    window.location.reload()
  } else {
    alert('Import failed: ' + result.error)
  }
  event.target.value = ''
}

function changeLocale() {
  locale.value = settings.uiLocale
}

function resetProgress() {
  if (confirm('Are you sure? This will delete all your progress.')) {
    const lang = settings.sourceLang
    localStorage.removeItem(`1kw_progress_${lang}`)
    localStorage.removeItem(`1kw_stats_${lang}`)
    localStorage.removeItem(`1kw_session_${lang}`)
    window.location.reload()
  }
}
</script>
