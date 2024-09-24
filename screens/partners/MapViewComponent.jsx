import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const MapViewComponent = (props) => {
    const {item,latitude,longitude,title,description} = props
  return (
    
        <MapView
                  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                  style={{height: '85%', width: '100%', marginBottom: 15}}
                  region={{
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}>
                  <Marker
                    title={title}
                    description={description}
                    image={require('../../assets/marker.png')}
                    coordinate={{
                      latitude: parseFloat(latitude),
                      longitude: parseFloat(longitude),
                    }}
                  />
                </MapView>
  );
}
export default MapViewComponent;
