import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "../../../styles/Colors";

const InformationView = (props) => {
  const { type, image, text, changeVisible } = props;
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Image source={image} style={styles.image} resizeMode="contain"/>
        <Text style={styles.infoText}>
         {text}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => changeVisible(true)}
        >
          <Text style={styles.textButton}>Registrar {type}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InformationView;

const styles = StyleSheet.create({
  containerInfo: {
    borderWidth: 2,
    borderColor: Colors.primaryColor,
    padding: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "5%",
  },
  image: {
    width: 60,
    height: 60,
  },
  infoText: {
    fontSize: 20,
    color: Colors.primaryColor,
    marginTop: "5%",
    marginBottom: "5%",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: "10%",
  },
  button: {
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    borderColor: Colors.primaryColor,
  },
  textButton: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primaryColor,
  },
});
