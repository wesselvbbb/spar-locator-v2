import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useContext } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../components/context/ThemeContext";
import { useTranslation } from "react-i18next";
import "../components/i18n";

export default function Home({ navigation }) {
  const [items, setItems] = useState([]); // Store items fetched from the api
  const [likedItems, setLikedItems] = useState([]); // Store liked items

  // Retrieve theme context value
  const { theme } = useContext(ThemeContext);

  // Translation functions
  const { t } = useTranslation();

  // Effect to fetch items and load liked items on mounting
  useEffect(() => {
    fetch(
      "https://stud.hosted.hr.nl/1027694/Programmeren/PRG07/Spar-Locator/webservice.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setItems(data.items);
      })
      .catch((error) => {
        console.error(error);
        setItems([]);
      });

    loadLikedItems();
  }, []);

  // Load liked items from AsyncStorage
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

  // Toggle like status from an item
  const toggleLikeItem = async (item) => {
    let updatedLikedItems;
    if (likedItems.some((likedItem) => likedItem.title === item.title)) {
      updatedLikedItems = likedItems.filter(
        (likedItem) => likedItem.title !== item.title
      );
      // Remove item from liked items
    } else {
      updatedLikedItems = [...likedItems, item]; // Add item to liked items
    }
    setLikedItems(updatedLikedItems);

    try {
      await AsyncStorage.setItem(
        "likedItems",
        JSON.stringify(updatedLikedItems)
      ); // Save updated liked items to AsyncStorage
    } catch (error) {
      console.error("Failed to save liked items", error);
    }
  };

  // Checks if an item with title is stored in the likedItems array
  const isLiked = (title) =>
    likedItems.some((likedItem) => likedItem.title === title);

  return (
    <>
      <ScrollView
        className={`h-full ${theme === "light" ? "bg-white" : "bg-black"}`}
      >
        <View className="py-4 flex-1 justify-center items-center">
          <Text
            className={`text-3xl font-bold py-2 ${
              theme === "light" ? "text-black" : "text-white"
            }`}
          >
            Spar Locator
          </Text>
          <Text
            className={`font-semibold text-lg italic mb-4 ${
              theme === "light" ? "text-black" : "text-white"
            }`}
          >
            {t("welcome")}
          </Text>
          {items.map((item, index) => (
            <View className="max-w-md w-full" key={index}>
              <View className="p-2">
                <View
                  className={`p-4 rounded-md gap-y-2 ${
                    theme === "light" ? "bg-gray-200" : "bg-gray-800"
                  }`}
                >
                  <View className="flex flex-row items-center justify-between">
                    <Text
                      className={`font-bold text-xl ${
                        theme === "light" ? "text-black" : "text-white"
                      }`}
                    >
                      {item.title}
                    </Text>
                    <TouchableOpacity onPress={() => toggleLikeItem(item)}>
                      <Ionicons
                        name={isLiked(item.title) ? "basket" : "basket-outline"}
                        size={24}
                        color="#D43E41"
                      />
                    </TouchableOpacity>
                  </View>

                  <Text
                    className={`${
                      theme === "light" ? "text-black" : "text-white"
                    }`}
                  >
                    {item.description}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Map", {
                        // parameters to show store location on map
                        location: item.location,
                        store: item,
                      })
                    }
                  >
                    <Text className={`underline font-semibold ${
                      theme === "light" ? "text-green" : "text-light-green"
                    }`}>
                      {t("show_on_map")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View
        className={`flex-row w-full items-center justify-between px-10 h-20 ${
          theme === "light" ? "bg-green" : "bg-black"
        }`}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
          <Ionicons name="basket" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Map")}>
          <Ionicons name="map" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-sharp" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
}
