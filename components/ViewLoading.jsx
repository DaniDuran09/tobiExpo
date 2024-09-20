import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Colors } from "../styles/Colors";

export default function ViewLoading(props = {}) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: props.backgroundColor ? props.backgroundColor : "#FFF",
      }}
    >
      <ActivityIndicator size="large" color={Colors.primaryColor} />
      <Text
        style={{
          color: props.color ? props.color : Colors.primaryColor,
          fontSize: 16,
          fontWeight: "700",
          marginTop: 10,
        }}
      >
        {props.waitString ? props.waitString : "..."}
      </Text>
    </View>
  );
}
