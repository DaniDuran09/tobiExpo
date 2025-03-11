import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "../../styles/Colors";
import SendMail from "../../components/user/SendMail";
import { Text, View } from "react-native-ui-lib";
import Entypo from "react-native-vector-icons/Entypo";
import Toast from "react-native-toast-message";
import AppStorage from "../../modules/AppStorage";
import { useNavigation } from "@react-navigation/native";
import { useSendPinMutation, useUpdatePasswordMutation } from "../../api/tobiApi/auth";

const ChangePassword = ({ route }) => {
  const { show = true, email = "" } = route?.params || {};
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [showRepeatPassword, setShowRepeatPassword] = useState(true);
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [pin, setPin] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [showMessage, setShowMessage] = useState(show);

  const [timer, setTimer] = useState(0);

  const appStorage = new AppStorage();
  const navigation = useNavigation();

  const [sendPin] = useSendPinMutation()
  const [updatePassword, { isLoading: isLoadingUpdatePassword }] = useUpdatePasswordMutation()

  useEffect(() => {
    setIsValid(
      pin.length == 6 &&
      newPassword != "" &&
      repeatNewPassword != "" &&
      newPassword == repeatNewPassword
    );
  }, [newPassword, repeatNewPassword, pin]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendEmail = () => {
    if (timer === 0) {
      send(email);
      setTimer(30);
    }
  };

  const changePassword = async () => {

    const payload = {
      pin: pin,
      password: newPassword,
      password_confirmation: repeatNewPassword,
    };

    const { error } = await updatePassword(payload)

    if (error) {
      Toast.show({
        type: "error",
        text1: "Ocurrió un error",
        text2: `Vuelve a intentarlo más tarde`,
      });
      return
    }

    Toast.show({
      type: "success",
      text1: "Nueva contraseña registrada",
      text2: `Recuerda tu nueva contraseña para el próximo inicio de sesión`,
    });
    if (!show)
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    else navigation.goBack();
  };

  const send = async () => {

    let emailToSend;
    if (email) emailToSend = email;
    else {
      const user = await appStorage.getUser();
      emailToSend = user.email;
    }

    const data = {
      email: emailToSend,
    };

    const { error } = await sendPin(data);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Error al enviar el correo",
        text2: `Inténtalo de nuevo más tarde`,
      });
      return
    }
    Toast.show({
      type: "success",
      text1: "PIN enviado al correo",
      text2: `Revisa tu bandeja de entrada`,
    });
    if (!email) setShowMessage(false);
  };

  return (
    <View flex backgroundColor={Colors.white}>
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
        enabled
      >
        {showMessage ? (
          <SendMail setShowMessage={setShowMessage} send={send} />
        ) : (
          <>
            <View padding-10>
              <View>
                <Text text60R>Restablece tu contraseña</Text>
              </View>
              <View>
                <Text marginT-20 marginB-5>
                  PIN
                </Text>
                <TextInput
                  value={pin}
                  keyboardType="number-pad"
                  placeholderTextColor="#000"
                  style={styles.textInput}
                  onChangeText={(e) => setPin(e)}
                  autoCapitalize="none"
                  maxLength={6}
                />
                <Text marginT-20 marginB-5>
                  Nueva contraseña
                </Text>
                <View row centerV>
                  <TextInput
                    value={newPassword}
                    placeholderTextColor="#000"
                    style={styles.textInput}
                    secureTextEntry={showPassword}
                    autoCapitalize="none"
                    onChangeText={(e) => setNewPassword(e)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 24 }}
                  >
                    <Entypo
                      name={showPassword ? "eye-with-line" : "eye"}
                      size={25}
                      color={Colors.gray}
                    />
                  </TouchableOpacity>
                </View>
                <Text marginT-20 marginB-5>
                  Confirmar contraseña nueva
                </Text>
                <View row centerV>
                  <TextInput
                    value={repeatNewPassword}
                    placeholderTextColor="#000"
                    style={styles.textInput}
                    secureTextEntry={showRepeatPassword}
                    autoCapitalize="none"
                    onChangeText={(e) => setRepeatNewPassword(e)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                    style={{ position: "absolute", right: 24 }}
                  >
                    <Entypo
                      name={showRepeatPassword ? "eye-with-line" : "eye"}
                      size={25}
                      color={Colors.gray}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View marginT-20 row gap-5>
                <Text>¿No te llegó ningún correo?</Text>
                <TouchableOpacity
                  onPress={handleResendEmail}
                  disabled={timer > 0}
                >
                  <Text
                    color={timer === 0 ? Colors.primaryColor : Colors.gray}
                    style={timer === 0 ? styles.resendText : null}
                  >
                    {timer > 0 ? `Reenviar en ${timer}s` : "Reenviar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View flex bottom paddingB-30 centerH>
              <TouchableOpacity
                disabled={!isValid}
                style={[
                  styles.buttonChangePassword,
                  !isValid && { backgroundColor: Colors.secondGray },
                ]}
                onPress={changePassword}
              >
                {isLoadingUpdatePassword ? (
                  <ActivityIndicator size={"small"} color={Colors.white} />
                ) : (
                  <Text text70BO color={Colors.white}>
                    Cambiar contraseña
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  textInput: {
    height: 60,
    width: "100%",
    paddingLeft: 20,
    justifyContent: "center",
    backgroundColor: Colors.lightBlue,
    borderRadius: 4,
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
  resendText: {
    textDecorationLine: "underline",
  },
});
