import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import ApiFetcher from "../../modules/ApiFetcher";
import { useNavigation } from "@react-navigation/native";
import Loading from "../../components/Loading";
import { isValidEmail } from "../../utils/validations";
import Toast from "react-native-toast-message";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [validEmail, setValidEmail] = useState(false);

  const onChangeEmailHandle = (text) => {
    setValidEmail(isValidEmail(text));
    setEmail(text);
  };

  const apiFetcher = new ApiFetcher();

  const navigation = useNavigation();

  const sendPin = async () => {
    setLoading(true);
    try {
      const data = {
        email: email,
      };
      await apiFetcher.sendPin(data);
      Toast.show({
        type: "success",
        text1: "PIN enviado al correo",
        text2: `Revisa tu bandeja de entrada`,
      });
      navigation.navigate("ChangePassword", {show: false, email: email})
    } catch (error) {
      console.log("error: ", error);
      Toast.show({
        type: "error",
        text1: "Error al enviar el correo",
        text2: `Verifica que el correo sea correcto o inténtalo de nuevo más tarde`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View flex backgroundColor={Colors.white} padding-10>
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
        enabled
      >
        {loading && (
          <Loading
            textColor={Colors.primaryColor}
            backgroundColorProp={Colors.white}
          />
        )}
        <Text text70BO>
          Le mandaremos un PIN de 6 dígitos para poder cambiar su contraseña
        </Text>
        <Text text80R marginT-20>
          Escriba su correo registrado.
        </Text>
        <View>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#000"
            keyboardType="email-address"
            value={email}
            style={[
              styles.textInput,
              {
                color: "#000",
              },
            ]}
            autoCapitalize="none"
            onChangeText={onChangeEmailHandle}
          />
        </View>
        <View flex bottom paddingB-20 centerH>
          <TouchableOpacity
            disabled={!validEmail}
            style={[styles.buttonChangePassword, !validEmail && {backgroundColor: Colors.secondGray}]}
            onPress={sendPin}
          >
            <Text text70BO color={Colors.white}>
              Enviar email
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  textInput: {
    height: 60,
    marginTop: 10,
    borderRadius: 6,
    paddingLeft: 20,
    justifyContent: "center",
    backgroundColor: Colors.lightBlue,
  },
  buttonChangePassword: {
    backgroundColor: Colors.primaryColor,
    width: "95%",
    minWidth: 350,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 65,
  },
});
