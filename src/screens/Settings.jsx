import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../components/context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Settings() {
  const { theme, toggleTheme } = useContext(ThemeContext);

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
          Settings
        </Text>
        <View className="mt-8 flex flex-row items-center">
          <TouchableOpacity
            onPress={() => toggleTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Ionicons name="moon" size={32} color="black" />
            ) : (
              <Ionicons name="sunny" size={32} color="yellow" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
