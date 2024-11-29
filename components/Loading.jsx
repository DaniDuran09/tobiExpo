import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../styles/Colors";

const Loading = (props) => {
  const {textColor, backgroundColorProp} = props
  useEffect(() => {
  }, []);
  return (
    <View style={[styles.loadingContainer, {backgroundColor: backgroundColorProp}]}>
      <ActivityIndicator size="large" color={textColor} />
      {/* <Text style={{color: textColor}}>Loading...</Text> */}
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2
  },
});
