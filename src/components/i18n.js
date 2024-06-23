import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

// Import translation json
import en from "../../assets/locales/en/en.json";
import es from "../../assets/locales/es/es.json";
import it from "../../assets/locales/it/it.json";
import nl from "../../assets/locales/nl/nl.json";
import de from "../../assets/locales/de/de.json";

// Retrieve devices locale
const locales = Localization.getLocales();
const languageCode = locales[0].languageCode; // Get the primary language code from the device

// Initialize i18next with react 
i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: {
    en: { translation: en },
    es: { translation: es },
    it: { translation: it },
    de: { translation: de },
    nl: { translation: nl },
  },
  lng: languageCode, // Set language to device primary language
  fallbackLng: "en", // Fallback to English when translation is not available
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
