// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./i18n/en.json";
import ar from "./i18n/ar.json";
import fr from "./i18n/fr.json";
import es from "./i18n/es.json";
import cn from "./i18n/cn.json";

const savedLang =
  localStorage.getItem("app-lang") ||
  localStorage.getItem("i18nextLng") ||
  "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    fr: { translation: fr },
    es: { translation: es },
    cn: { translation: cn },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
