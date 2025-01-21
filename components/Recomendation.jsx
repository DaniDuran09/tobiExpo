import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../styles/Colors";

const Recomendation = ({
  image = "",
  title = "",
  info = "",
  setVisible = (visible)=>{},
  oneOption = false,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.containerInfo}>
      <Image
        source={image ? image : require("../assets/prueba.png")}
        style={styles.image}
      />
      <View style={styles.containerLetters}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.info}>{info}</Text>
        {oneOption ? (
          <TouchableOpacity
            style={[styles.priceContainer, { width: "90%" }]}
            onPress={() => navigation.navigate("Explore")}
          >
            <Text style={styles.infoPrice}>Sí, quiero una cita</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.priceContainer, { width: "35%" }]}
              onPress={() => navigation.navigate("Explore")}
            >
              <Text style={styles.infoPrice}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.priceContainer, { width: "65%" }]}
              onPress={() => setVisible(true)}
            >
              <Text style={styles.infoPrice}>Más tarde</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Recomendation;

const styles = StyleSheet.create({
  containerInfo: {
    marginTop: 15,
    backgroundColor: Colors.pink,
    padding: 20,
    borderRadius: 8,
    flexDirection: "row",
    gap: 15,
  },
  image: {
    width: 140,
    height: 180,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  info: {
    fontSize: 16,
    marginTop: 12,
    color: Colors.primaryColor,
  },
  priceContainer: {
    borderWidth: 0.8,
    borderColor: Colors.primaryColor,
    marginTop: 12,
    borderRadius: 4,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  infoPrice: {
    color: Colors.primaryColor,
  },
  button: {
    marginTop: 12,
  },
  textButton: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
  containerLetters: {
    width: "50%",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
});
