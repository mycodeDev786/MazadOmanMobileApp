import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigation/RootNavigator";
import React, { useState, useEffect } from "react";
import { I18nManager } from "react-native";
import { useTranslation } from "react-i18next";
import "./locales/i18n"; // Import your i18n configuration
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function App() {
  const { t, i18n } = useTranslation();
  const [appKey, setAppKey] = useState(0); // Key to force re-render

  useEffect(() => {
    // When the language changes, update the key to force re-render
    const onLanguageChanged = () => {
      setAppKey((prevKey) => prevKey + 1);
    };
    i18n.on("languageChanged", onLanguageChanged);
    return () => {
      i18n.off("languageChanged", onLanguageChanged);
    };
  }, []);

  const changeLanguage = async (lng) => {
    await i18n.changeLanguage(lng);
    // After changing language, force RTL/LTR layout immediately
    if (lng === "ar") {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
    // Increment the key to force re-render the entire app
    setAppKey((prevKey) => prevKey + 1);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}
