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
import { useNavigation } from "@react-navigation/native";

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null); // State to track the selected marker
  const [modalVisible, setModalVisible] = useState(false); // State to control the modal visibility

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
  }, []);

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

  const navigation = useNavigation();

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
    setModalVisible(true);
  };

  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.map}
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
            title={marker.title}
            onPress={() => handleMarkerPress(marker)}
          >
            <Image
              source={require("@../../../assets/sparlogo.png")}
              style={{ width: 30, height: 30, objectFit: "contain" }}
            />
          </Marker>
        ))}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You're here!"
          >
            <Ionicons name="location" size={24} color="#D43E41" />
          </Marker>
        )}
      </MapView>
      <TouchableOpacity
        style={[styles.locationButton]}
        onPress={goToUserLocation}
      >
        <Ionicons name="location" size={42} color="#D43E41" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
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
