import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import { ThemeContext } from "../components/context/ThemeContext";
import { useTranslation } from "react-i18next";
import "../components/i18n";

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [distance, setDistance] = useState(null);

  const { theme } = useContext(ThemeContext);

  const route = useRoute();
  const { t } = useTranslation();

  // Fetch markers from webservice and set them in state
  useEffect(() => {
    fetch(
      "https://stud.hosted.hr.nl/1027694/Programmeren/PRG07/Spar-Locator/webservice.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setMarkers(data.items);
      })
      .catch((error) => {
        console.error(error);
      });

// If a store is passed in route parameters, handle marker press (opening modal)
    if (route.params?.store) {
      handleMarkerPress(route.params.store);
    }
  }, [route.params]);

  // Request location permissions of the user
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  // Animate to users location
  const goToUserLocation = () => {
    if (location) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  // Open modal when clicking on a marker
  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
    calculateDistance(marker);
    setModalVisible(true);
    mapRef.current.animateToRegion({
      latitude: marker.latitude,
      longitude: marker.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  // Calculate the distance between user and store
  // Source: https://www.movable-type.co.uk/scripts/latlong.html
  const calculateDistance = (marker) => {
    if (location) {
      const R = 6371; // Radius of the earth in km 
      const lat1 = location.latitude;
      const lon1 = location.longitude;
      const lat2 = marker.latitude;
      const lon2 = marker.longitude;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      setDistance(distance.toFixed(2));
    }
  };

  return (
    <>
    {/* Display map and markers */}
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        region={{
          latitude: 51.926517,
          longitude: 4.462456,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        userInterfaceStyle={theme === "light" ? "light" : "dark"}
      >
        {/* Map all markers on the map */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => handleMarkerPress(marker)}
          >
            <Image
              source={require("@../../../assets/sparlogo.png")}
              style={{ width: 30, height: 30, objectFit: "contain" }}
            />
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity
        style={[styles.locationButton]}
        onPress={goToUserLocation}
      >
        <View
          className={`rounded-full p-2 ${
            theme === "light" ? "bg-white" : "bg-black"
          }`}
        >
          <Ionicons name="pin-sharp" size={32} color="#D43E41" />
        </View>
      </TouchableOpacity>
      {/* Modal to show details of a store */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View
          className={`h-72 w-full absolute bottom-0 ${
            theme === "light" ? "bg-white" : "bg-black"
          }`}
        >
          <View className="px-5 py-2 pt-10 rounded-lg gap-y-4">
            <Text
              className={`text-xl font-bold ${
                theme === "light" ? "text-black" : "text-white"
              }`}
            >
              {selectedMarker?.title}
            </Text>
            <Text
              className={`${theme === "light" ? "text-black" : "text-white"}`}
            >
              {selectedMarker?.description}
            </Text>
            {distance && (
              <Text
                className={`${theme === "light" ? "text-black" : "text-white"}`}
              >
                {t("Map.distance")}: {distance} km
              </Text>
            )}
            <TouchableOpacity
              className="bg-red px-4 py-2 w-1/2 rounded-lg flex items-center justify-center"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white font-bold">{t("Button.close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  locationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 25,
    padding: 10,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    fontSize: 18,
    color: "#D43E41",
    textAlign: "center",
    marginTop: 20,
  },
});
