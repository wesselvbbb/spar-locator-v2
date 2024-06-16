import React, { createContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme(colorScheme || "light");
      }
    } catch (error) {
      console.error("Failed to load theme preference", error);
    }
  };

  const toggleTheme = (selectedTheme) => {
    const newTheme = selectedTheme || (theme === "light" ? "dark" : "light");
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const saveTheme = async (selectedTheme) => {
    try {
      await AsyncStorage.setItem("theme", selectedTheme);
    } catch (error) {
      console.error("Failed to save theme preference", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
