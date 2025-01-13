import { useState } from "react";
import { Linking, Platform } from "react-native";
import { ActionSheet, Text, View } from "react-native-ui-lib";

export const OpenDirectionMap = ({ latitude, longitude, setShowActionSheet, showActionSheet }) => {

  const handleOptionPress = (index) => {
    setShowActionSheet(false);
    if (index === 0) {
      openMap(latitude, longitude, "Google Maps");
    } else if (index === 1) {
      openMap(latitude, longitude, "Apple Maps");
    }
  };

  const openMap = (latitude, longitude, app) => {
    const location = `${latitude},${longitude}`;

    switch (app) {
      case "Google Maps":
        const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${location}&travelmode=driving`;
        Linking.openURL(googleUrl);
        break;
      case "Apple Maps":
        const appleUrl = `http://maps.apple.com/?daddr=${location}&dirflg=d`;
        Linking.openURL(appleUrl);
        break;
      default:
        break;
    }
  };
  return (
    <View>
      <ActionSheet
        useNativeIOS={Platform.OS == "ios"}
        visible={showActionSheet}
        title={"Abrir en..."}
        message={"Elige una aplicación para ver la ubicación"}
        cancelButtonIndex={2}
        onDismiss={() => setShowActionSheet(false)}
        destructiveButtonIndex={0}
        options={[
          { label: "Google Maps", onPress: () => handleOptionPress(0) },
          Platform.OS == "ios" && {
            label: "Maps",
            onPress: () => handleOptionPress(1),
          },
          { label: "Cancelar", onPress: () => setShowActionSheet(false) },
        ]}
      />
    </View>
  );
};
