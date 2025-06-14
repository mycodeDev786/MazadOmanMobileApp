// src/i18n.js or locales/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager } from "react-native";

import en from "./en.json";
import ar from "./ar.json";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

const LANGUAGE_KEY = "user-language";

const languageDetector = {
  type: "languageDetector",
  async: true,
  init: () => {},
  detect: async (callback) => {
    try {
      // Try to get language from AsyncStorage
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (storedLanguage) {
        return callback(storedLanguage);
      }

      // If not found, use device locale
      const deviceLanguage = Localization.getLocales()[0].languageCode;
      return callback(deviceLanguage || "en"); // Default to 'en' if device locale is not available
    } catch (error) {
      console.error("Error detecting language:", error);
      return callback("en"); // Fallback in case of error
    }
  },
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.error("Error caching language:", error);
    }
  },
};

i18n
  .use(languageDetector) // Use our custom language detector
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    compatibilityJSON: "v3", // Required for React Native
    fallbackLng: "en", // Fallback language if translation is missing
    interpolation: {
      escapeValue: false, // react-native already escapes everything
    },
  });

// Handle RTL for Arabic
i18n.on("languageChanged", (lng) => {
  if (lng === "ar") {
    I18nManager.forceRTL(true);
  } else {
    I18nManager.forceRTL(false);
  }
  // This is crucial for applying RTL changes without requiring app restart
  // You might need to reload or re-render your root component
  // A common approach is to update a key on your root component
  // to force a re-render. We'll show this in App.js.
});

export default i18n;
