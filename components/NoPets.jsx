import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Colors, gradientColors } from "../styles/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native-ui-lib";

const NoPets = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <View style={styles.gradientInter}>
          <Text text70BO color={Colors.primaryColor}>No hay mascotas registradas</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default NoPets;

const styles = StyleSheet.create({
  gradient: {
    height: 60,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    border: 10,
  },
  gradientInter: {
    height: 55,
    width: 295,
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
