import { languages } from '../data/languages.js'

export function useDataTransfer() {
  function exportAllData() {
    const langCodes = Object.keys(languages)

    const data = {
      app: '1kwords',
      version: 1,
      exportDate: new Date().toISOString(),
      settings: readJson('1kw_settings'),
      progress: {},
      stats: {},
      sessions: {},
    }

    for (const lang of langCodes) {
      data.progress[lang] = readJson(`1kw_progress_${lang}`)
      data.stats[lang] = readJson(`1kw_stats_${lang}`)
      data.sessions[lang] = readJson(`1kw_session_${lang}`)
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const date = new Date().toISOString().slice(0, 10)
    const a = document.createElement('a')
    a.href = url
    a.download = `1kwords-backup-${date}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function importAllData(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)

          if (data.app !== '1kwords') {
            resolve({ success: false, error: 'Invalid backup file: missing app identifier.' })
            return
          }

          if (data.settings) {
            localStorage.setItem('1kw_settings', JSON.stringify(data.settings))
          }

          const langCodes = Object.keys(languages)
          for (const lang of langCodes) {
            if (data.progress?.[lang]) {
              localStorage.setItem(`1kw_progress_${lang}`, JSON.stringify(data.progress[lang]))
            }
            if (data.stats?.[lang]) {
              localStorage.setItem(`1kw_stats_${lang}`, JSON.stringify(data.stats[lang]))
            }
            if (data.sessions?.[lang]) {
              localStorage.setItem(`1kw_session_${lang}`, JSON.stringify(data.sessions[lang]))
            }
          }

          resolve({ success: true })
        } catch {
          resolve({ success: false, error: 'Failed to parse backup file.' })
        }
      }
      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read file.' })
      }
      reader.readAsText(file)
    })
  }

  return { exportAllData, importAllData }
}

function readJson(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
