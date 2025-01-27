import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    welcome: 'Welcome',
    // Add more translations
  },
  es: {
    welcome: 'Bienvenido',
    // Add more translations
  },
  // Add more languages
};

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en', 
  messages,
});

export default i18n;
