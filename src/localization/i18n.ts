import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import en from './translations/en.json';

const DEFAULT_LOCALE = 'en';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  defaultNS: 'translation',
  fallbackLng: DEFAULT_LOCALE,
  interpolation: {
    escapeValue: false,
  },
  lng: DEFAULT_LOCALE,
  resources: {
    en: {
      translation: en as Record<string, unknown>,
    },
  },
});

export default i18n;
