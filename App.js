import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from "./src/screens/Settings";
import Map from "./src/screens/Map";
import Home from "./src/screens/Home";
import Favorites from "./src/screens/Favorites";
import {
  ThemeContext,
  ThemeProvider,
} from "./src/components/context/ThemeContext";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "./src/components/i18n";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { theme } = useContext(ThemeContext);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem("selectedLanguage");
      if (storedLanguage) {
        i18n.changeLanguage(storedLanguage);
      }
    };
    loadLanguage();
  }, [i18n]);

  const backgroundColor = theme === "light" ? "#32733C" : "#111827";

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitle: "",
          headerBackTitle: t("back"),
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor,
          },
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Favorites" component={Favorites} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}
