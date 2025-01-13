import React from "react";
import MapView, { Marker } from "react-native-maps";


const MapViewComponent = (props) => {
  const { latitude, longitude, title, description } = props;

  console.log("longitude: ", latitude, longitude)
  return (
    <MapView
      style={{ height: "85%", width: "100%", marginBottom: 15 }}
      region={{
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}
    >
      <Marker
        title={title}
        description={description}
        image={require("../../assets/marker.png")}
        coordinate={{
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        }}
      />
    </MapView>
  );
};
export default MapViewComponent;
