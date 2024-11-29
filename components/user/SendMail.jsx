import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Text, View } from "react-native-ui-lib";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors } from "../../styles/Colors";
import AnimatedLottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import ApiFetcher from "../../modules/ApiFetcher";
import AppStorage from "../../modules/AppStorage";
import Toast from "react-native-toast-message";
import Loading from "../Loading";

const SendMail = (props) => {
    const {send} = props
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const cancel = () => navigation.goBack();
  return (
    <View flex center padding-10>
      {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      <View center marginT-20>
        <Text text80BO>
          Para el cambio de su contrseña se le mandará un PIN de 6 dígitos a su
          correo registrado
        </Text>
        <AnimatedLottieView
          source={require("../../assets/animations/requestPin.json")}
          autoPlay
          loop={false}
          style={styles.animation}
        />
      </View>

      <View flex bottom paddingB-50 row gap-40>
        <TouchableOpacity style={styles.cancelButton} onPress={cancel}>
          <Text text70BO>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={send}>
          <Text text70BO color={Colors.white}>
            Mandar Email
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SendMail;

const styles = StyleSheet.create({
  sendButton: {
    width: 150,
    backgroundColor: Colors.primaryColor,
    padding: 15,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    width: 150,
    backgroundColor: Colors.white,
    borderWidth: 1,
    padding: 15,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 250,
    height: 250,
    marginTop: "20%",
  },
});
