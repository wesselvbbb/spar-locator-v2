import React, { createContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext({
  theme: "light", // Default theme
  toggleTheme: () => {}, // Default toggleTheme function is empty
});

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme(); // Get the device's color scheme
  const [theme, setTheme] = useState("light"); 

  // Load the saved theme preference from AsyncStorage on mounting
  useEffect(() => {
    loadTheme();
  }, []);

  // Load theme function to load preference from AsyncStorage
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme"); // Retrieve saved theme
      if (savedTheme) {
        setTheme(savedTheme); // Set theme to saved theme when available
      } else {
        setTheme(colorScheme || "light"); // Set theme to device color scheme or set to default light theme
      }
    } catch (error) {
      console.error("Failed to load theme preference", error);
    }
  };

  // Toggle function to change theme
  const toggleTheme = (selectedTheme) => {
    const newTheme = selectedTheme || (theme === "light" ? "dark" : "light"); 
    setTheme(newTheme); 
    saveTheme(newTheme);
  };

  // Save selected theme to AsyncStorage
  const saveTheme = async (selectedTheme) => {
    try {
      await AsyncStorage.setItem("theme", selectedTheme);
    } catch (error) {
      console.error("Failed to save theme preference", error);
    }
  };

  //Provide current theme and toggleTheme function to the context provider
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
