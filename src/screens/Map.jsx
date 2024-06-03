import React, { useState, useEffect, useRef } from "react";
import { ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null);

  const [markers, setMarkers] = useState([]);

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
            // TODO: Add function to go to store page
            onPress={(e) => console.log("Going to store page")}
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
  locationIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
