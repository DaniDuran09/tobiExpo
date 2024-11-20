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
import { setServiceInfo } from "../redux/slice/appointmentSlice";
import { useDispatch } from "react-redux";

const ServiceOption = (props) => {
  const { service, picture, listService, users, partnerId, partnerLocation } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch()

  const goToCreateDate = async () => {
    navigation.navigate("InfoServiceForDate", { users: users, partnerId: partnerId, partnerLocation: partnerLocation });
    dispatch(
      setServiceInfo(
        listService
      )
    );
  };
  return (
    <View style={styles.containerOption}>
      <TouchableOpacity style={styles.button} onPress={goToCreateDate}>
        <Text style={styles.text}>{service?.name}</Text>
        <Image
          source={{ uri: picture }}
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
