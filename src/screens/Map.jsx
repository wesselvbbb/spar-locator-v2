import React, { useState, useEffect, useRef } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [distance, setDistance] = useState(null);

  const route = useRoute();
  const navigation = useNavigation();

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

    if (route.params?.store) {
      handleMarkerPress(route.params.store);
    }
  }, [route.params]);

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
      const R = 6371;
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
      const distance = R * c;
      setDistance(distance.toFixed(2));
    }
  };

  return (
    <>
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
      >
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
        <View className="bg-white rounded-full p-2">
          <Ionicons name="pin-sharp" size={32} color="#D43E41" />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View className="bg-white h-72 w-full absolute bottom-0">
          <View className="px-5 py-2 pt-10 rounded-lg gap-y-4">
            <Text className="text-xl font-bold">{selectedMarker?.title}</Text>
            <Text>{selectedMarker?.description}</Text>
            {distance && <Text>Distance: {distance} km</Text>}
            <TouchableOpacity
              className="bg-red px-4 py-2 w-1/2 rounded-lg flex items-center justify-center"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white font-bold">Close</Text>
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
