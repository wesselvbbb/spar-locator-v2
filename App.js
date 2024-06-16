import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Settings from "./src/screens/Settings";
import Map from "./src/screens/Map";
import Home from "./src/screens/Home";
import Favorites from "./src/screens/Favorites";
import {
  ThemeProvider,
  ThemeContext,
} from "./src/components/context/ThemeContext";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./src/components/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

export default function App() {
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

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitle: "",
            headerBackTitle: t("back"),
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#32733C",
            },
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Favorites" component={Favorites} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
