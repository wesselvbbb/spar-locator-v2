import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Home({ navigation }) {
  const [items, setItems] = useState([]);
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
  }, []);

  return (
    <ScrollView className="h-full">
      <View className="py-4 flex-1 justify-center items-center">
        <Text className="text-3xl font-bold">Spar Locator</Text>
        {items.map((item, index) => (
          <View className="max-w-md w-full" key={index}>
            <View className="p-2">
              <View className="bg-gray-200 p-4 rounded-md gap-y-2">
                <View className="flex items-end justify-end">
                  {/* If liked show filled basket */}
                  <TouchableOpacity>
                    <Ionicons name="basket-outline" size={24} color="#D43E41" />
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Ionicons name="basket" size={24} color="#D43E41" />
                  </TouchableOpacity>
                </View>
                <Text className="font-bold text-xl">{item.title}</Text>
                <Text className="">{item.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View className="flex-row w-full items-center justify-between px-10 bg-green h-24">
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="basket" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Map")}>
          <Ionicons name="map" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
          <Ionicons name="settings-sharp" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
