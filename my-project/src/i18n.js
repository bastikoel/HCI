// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files
import en from './locales/en.json';
import zh from './locales/zh.json';
import ms from './locales/ms.json';
import hi from './locales/hi.json';

// Configure i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      ms: { translation: ms },
      hi: { translation: hi },
    },
    lng: 'en', // Change default language to Hindi
    fallbackLng: 'en', // if translation is missing in selected language, fallback to English
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
