import { Image, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../styles/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, View } from "react-native-ui-lib";

const ScreenInternetError = (props) => {
  const { action } = props;
  return (
    <View flex center>
      <Text text50BO grey marginB-20>
        Ooops!
      </Text>
      <Image source={require("../assets/images/errorInternetImage.png")} />
      <View width={"70%"} marginT-50>
        <Text text90 center grey20>
          El jefe de internet se fue de vacaciones a la playa y se le olvidó
          pagarlo.
        </Text>
        <Text text90 center grey20>
          Regresa más tarde y vuelve a intentarlo.
        </Text>
        <Text text90 center grey20>
          Te estamos esperando
        </Text>
      </View>
      <View marginT-50>
        <TouchableOpacity style={styles.buttonOption} onPress={action}>
          <Text text80BO color={Colors.primaryColor}>
            Aceptar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScreenInternetError;

const styles = StyleSheet.create({
  buttonOption: {
    height: 50,
    width: 120,
    padding: 5,
    borderRadius: 4,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
