import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Favorites({ navigation }) {
  const [likedItems, setLikedItems] = useState([]);

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
    <ScrollView className="h-full">
      <View className="my-16 flex-1 justify-center items-center">
        <Text className="text-3xl font-bold">Favorites</Text>
      </View>
      {likedItems.length > 0 ? (
        likedItems.map((item, index) => (
          <View className="p-2" key={index}>
            <View className="bg-gray-200 p-4 rounded-md gap-y-2">
              <Text className="font-bold text-xl">{item.title}</Text>

              <Text>{item.description}</Text>
            </View>
          </View>
        ))
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg">No favorites yet!</Text>
        </View>
      )}
    </ScrollView>
  );
}
