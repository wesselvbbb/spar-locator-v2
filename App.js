import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
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
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index}>
          <Text className="text-red-500">{item.title}</Text>
          <Text className="text-red-500">{item.description}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
