import { Image, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "../styles/Colors";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";

const ScreenServerError = (props) => {
  const { refetch } = props;
  return (
    <View flex center>
      <Text text50BO grey marginB-20>
        ¡Oh que pena!
      </Text>
      <Image source={require("../assets/images/errorServerError.png")} />
      <View width={"70%"} marginT-50>
        <Text text90 center grey20>
          Lo sentimos, nuestros gatos provocaron un problema con el servidor.
        </Text>
        <Text text90 center grey20>
          Mientras tanto podrías explorar su fascinante mundo.
        </Text>
      </View>
      <View row gap-50 marginT-50>
        <TouchableOpacity style={styles.buttonOption}>
          <Text text80BO color={Colors.primaryColor}>
            Mundo de {""}
          </Text>
          <Text text80BO color={Colors.primaryColor}>
            los gatos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonOption} onPress={refetch}>
          <Text text80BO color={Colors.primaryColor}>
            Reintentar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScreenServerError;

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
