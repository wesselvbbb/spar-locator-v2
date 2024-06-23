import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ThemeContext } from "../components/context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import "../components/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountryFlag from "react-native-country-flag";

export default function Settings() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // Load the selected language from AsyncStorage on mounting
  useEffect(() => {
    const getLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem("selectedLanguage");
      if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
        i18n.changeLanguage(storedLanguage); // Update i18n with stored language
      }
    };
    getLanguage();
  }, []);

  // Function to change the selected language
  const changeLanguage = async (lng) => {
    await AsyncStorage.setItem("selectedLanguage", lng); // Save selected language
    setSelectedLanguage(lng); // update state with selected language
    i18n.changeLanguage(lng); // update i18n with new language
  };

  // Array for all languages with iso codes
  const languages = [
    { isoCode: "gb", lang: "en" },
    { isoCode: "nl", lang: "nl" },
    { isoCode: "es", lang: "es" },
    { isoCode: "it", lang: "it" },
    { isoCode: "de", lang: "de" },
  ]
  return (
    <ScrollView
      className={`h-full ${theme === "light" ? "bg-white" : "bg-black"}`}
    >
      <View className="mt-16 mb-4 flex-1 justify-center items-center">
        <Text
          className={`text-3xl font-bold ${
            theme === "light" ? "text-black" : "text-white"
          }`}
        >
          {t("Settings.title")}
        </Text>
      </View>
      <View className="flex flex-col gap-y-4 justify-start px-10">
        <Text
          className={`text-md font-bold ${
            theme === "light" ? "text-black" : "text-white"
          }`}
        >
          {t("Settings.theme")}
        </Text>
        <TouchableOpacity
          onPress={() => toggleTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <Ionicons name="moon" size={32} color="black" />
          ) : (
            <Ionicons name="sunny" size={32} color="yellow" />
          )}
        </TouchableOpacity>
        <Text
          className={`text-md font-bold ${
            theme === "light" ? "text-black" : "text-white"
          }`}
        >
          {t("Settings.language")}
        </Text>
        <View className="flex flex-row gap-4">
          {/* Map languages for country flags */}
          {
          languages.map(({ isoCode, lang }) => (
            <TouchableOpacity
              key={isoCode}
              onPress={() => changeLanguage(lang)}
              className={
                selectedLanguage === lang
                  ? theme === "light"
                    ? "border-2 border-black"
                    : "border-2 border-white"
                  : "border-none"
              }
            >
              <CountryFlag isoCode={isoCode} size={25} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
