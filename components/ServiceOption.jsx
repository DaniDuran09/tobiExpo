import { Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../styles/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import groomingOption1 from "../assets/grooming-option1.png";
import groomingOption2 from "../assets/grooming-option2.png";
import groomingOption3 from "../assets/grooming-option3.png";
import groomingOption4 from "../assets/grooming-option4.png";
import groomingOption5 from "../assets/grooming-option5.png";
import groomingOption6 from "../assets/grooming-option6.png";
import vetOption1 from "../assets/vet-option1.png";
import vetOption2 from "../assets/vet-option2.png";
import vetOption4 from "../assets/vet-option4.png";
import vetOption5 from "../assets/vet-option5.png";
import { useNavigation } from "@react-navigation/native";

const ServiceOption = (props) => {
  const { service, picture,partenerLocation } = props;

  const navigation = useNavigation();

  const serviceImages = {
    "Consulta general veterinaria": vetOption5,
    "Consulta de especialidad": vetOption5,
    Vacunación: vetOption1,
    Desparasitación: vetOption2,
    "Laboratorio clínico": vetOption1,
    "Profilaxis dental": groomingOption5,
    Esterilizaciones: vetOption4,
    "Vet Option 2": vetOption2,
    "Vet Option 4": vetOption4,
    "Vet Option 5": vetOption1,
  };

  // const selectedImage = serviceImages[title];

  const goToCreateDate = async () => {
    navigation.navigate("InfoServiceForDate", { service: service, partenerLocation:partenerLocation  });
  };
  return (
    <View style={styles.containerOption}>
      <TouchableOpacity style={styles.button} onPress={goToCreateDate}>
        <Text style={styles.text}>{service?.name}</Text>
        <Image
          source={{uri: picture}}
          style={styles.image}
          resizeMode={"contain"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ServiceOption;

const styles = StyleSheet.create({
  containerOption: {
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    margin: 5,
    marginTop: 10,
    width: "30%",
    borderRadius: 16,
    justifyContent: "center",
    padding: 5,
  },
  button: {
    alignItems: "center",
  },
  image: {
    height: 50,
    width: 50,
    marginTop: 5,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
