import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import localeEn from './Locale/en';
import localeDe from './Locale/de';

i18n.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: localeEn,
      de: localeDe
    }
  });
