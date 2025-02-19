import React, { useState } from "react";
import { KeyboardAvoidingView, Linking } from "react-native";

import { useDispatch } from "react-redux";

import AppStorage from "../../modules/AppStorage";
import { setUserInfo } from "../../redux/slice/userSlice";
import { Colors } from "../../styles/Colors";
import Loading from "../../components/Loading";
import Toast from "react-native-toast-message";
import { View, Image, Text, TouchableOpacity } from "react-native-ui-lib";
import LoginForm from "../../components/auth/LoginForm";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoginMutation } from "../../api/auth/auth";

const LoginScreen = () => {
  const appStorage = new AppStorage();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [login, { isLoading }] = useLoginMutation();

  const loginHandle = async ({ username, password }: LoginPayload) => {
    try {
      const data = {
        username: username,
        password: password,
      };
      const { data: response } = await login(data);
      await appStorage.saveUser(response?.data);
      await appStorage.saveAppToken(response?.data.token);

      dispatch(setUserInfo(response?.data));

      navigation.replace("Home");
    } catch (error) {
      console.log("Error:", error);
      Toast.show({
        type: "error",
        text1: "Usuario y/o contraseña incorrectas",
        text2: `Verifique sus credenciales.`,
      });
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.danger }}>
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: "column" }}
        behavior={"height"}
      >
        {isLoading && (
          <Loading
            textColor={Colors.white}
            backgroundColorProp={Colors.danger}
          />
        )}
        <View flex>
          <View flex>
            <View paddingL-20>
              <Image
                source={require("../../assets/Logo.png")}
                height={80}
                width={150}
                resizeMode={"contain"}
              />
            </View>

            <LoginForm onSubmit={loginHandle} />
          </View>
          <View centerH>
            <View absB center>
              <Text color={Colors.secondaryColor}>
                Al registrarse, aceptas el
              </Text>
              <View row>
                <TouchableOpacity
                  onPress={() =>
                    openLink("https://tobipets.mx/terminos-y-condiciones-app")
                  }
                >
                  <Text color={Colors.secondaryColor}>Aviso de usuario </Text>
                </TouchableOpacity>
                <Text color={Colors.secondaryColor}>y la </Text>
                <TouchableOpacity
                  onPress={() =>
                    openLink("https://tobipets.mx/aviso-de-privacidad-app")
                  }
                >
                  <Text color={Colors.secondaryColor}>
                    Política de Privacidad
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
