import React from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";

import { useDispatch } from "react-redux";

import AppStorage from "../../modules/AppStorage";
import { setUserInfo } from "../../redux/slice/userSlice";
import { Colors } from "../../styles/Colors";
import Loading from "../../components/Loading";
import ApiFetcher from "../../modules/ApiFetcher";
import Toast from "react-native-toast-message";
import { View, Image, Text } from "react-native-ui-lib";
import LoginForm from "../../components/auth/LoginForm";

const LoginScreen = ({ navigation }) => {

  const [loading, setLoading] = React.useState(false);

  const appStorage = new AppStorage();
  const apiFetcher = new ApiFetcher();
  const dispatch = useDispatch();

  const loginHandle = async ({ username, password }) => {
    setLoading(true);
    try {
      let data = {
        username: username,
        password: password,
      };
      const response = await apiFetcher.login(data);
      console.log("Response: ", response);
      await appStorage.saveUser(response.data);
      dispatch(setUserInfo(response.data));
      await appStorage.saveAppToken(response.data.token);

      navigation.replace("Home");
    } catch (error) {
      console.log("Error:", error);
      Toast.show({
        type: "error",
        text1: "Usuario y/o contraseña incorrectas",
        text2: `Verifique sus credenciales.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: "column" }}
      behavior={"height"}
    >
      {loading && (
        <Loading
          textColor={Colors.white}
          backgroundColorProp={Colors.primaryColor}
        />
      )}
      <View
        height={height / 1}
        width={width}
        backgroundColor="#EF4136"
      >
        <View
          height={"20%"}
          width={"100%"}
          paddingL-20
          style={{
            justifyContent: "space-around",
            alignItems: "flex-start",
          }}
        >
          <Image
            source={require("../../assets/Logo.png")}
            height={80}
            width={150}
            resizeMode={"contain"}
          />
        </View>

        <LoginForm onSubmit={loginHandle} />

        <View
          height={"30%"}
          width={"100%"}
        >
          <View style={{ position: "absolute", bottom: "20%", left: "20%" }}>
            <Text
              center
              color={"#E6F8DB"}
              style={{ fontSize: 14, fontWeight: 300 }}
            >
              Al registrarse, aceptas el
            </Text>
            <Text
              center
              color={"#E6F8DB"}
              style={{ fontSize: 14, fontWeight: 300 }}
            >
              Aviso de usuario y la Política de Privacidad.
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const { height, width } = Dimensions.get("window");