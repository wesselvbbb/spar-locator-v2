import { useEffect, useState, useContext } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../components/context/ThemeContext";
import { useTranslation } from "react-i18next";
import "../components/i18n";

export default function Favorites() {
  const [likedItems, setLikedItems] = useState([]);
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const loadLikedItems = async () => {
      try {
        const savedLikedItems = await AsyncStorage.getItem("likedItems");
        if (savedLikedItems) {
          const parsedItems = JSON.parse(savedLikedItems).filter(
            (item) => typeof item === "object" && item !== null
          );
          setLikedItems(parsedItems);
        }
      } catch (error) {
        console.error("Failed to load liked items", error);
      }
    };

    loadLikedItems();
  }, []);

  return (
    <ScrollView
      className={`h-full ${theme === "light" ? "bg-white" : "bg-black"}`}
    >
      <View className="my-16 flex-1 justify-center items-center">
        <Text
          className={`text-3xl font-bold ${
            theme === "light" ? "text-black" : "text-white"
          }`}
        >
          {t("Favorites.title")}
        </Text>
      </View>
      {likedItems.length > 0 ? (
        likedItems.map((item, index) => (
          <View className="p-2" key={index}>
            <View
              className={`p-4 rounded-md gap-y-2 ${
                theme === "light" ? "bg-gray-200" : "bg-gray-800"
              }`}
            >
              <Text
                className={`font-bold text-xl ${
                  theme === "light" ? "text-black" : "text-white"
                }`}
              >
                {item.title}
              </Text>

              <Text
                className={`${theme === "light" ? "text-black" : "text-white"}`}
              >
                {item.description}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text
            className={`text-lg ${
              theme === "light" ? "text-black" : "text-white"
            }`}
          >
            {t("Favorites.not_found")}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
