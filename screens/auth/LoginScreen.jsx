import React from "react";
import {
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";

import { useDispatch } from "react-redux";

import AppStorage from "../../modules/AppStorage";
import { setUserInfo } from "../../redux/slice/userSlice";
import Entypo from "react-native-vector-icons/Entypo";
import { Colors } from "../../styles/Colors";
import Loading from "../../components/Loading";
import ApiFetcher from "../../modules/ApiFetcher";
import Toast from "react-native-toast-message";
import { View, Image, Text } from "react-native-ui-lib";

const LoginScreen = ({ navigation }) => {

  const [input, setInput] = React.useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

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
        <View
          height={"25%"}
          width={"100%"}
          centerH
          style={{
            justifyContent: "space-around",
          }}
        >
          <TextInput
            placeholder="Email"
            placeholderTextColor="#000"
            elevation={5}
            keyboardType="email-address"
            style={[
              styles.textInput,
              {
                color: "#000",
              },
            ]}
            autoCapitalize="none"
            onChangeText={(val) => setInput({ ...input, username: val })}
          />
          <View
            row
            centerV
            style={[
              styles.textInput,
              {
                justifyContent: "space-between",
                flexDirection: "row",
              },
            ]}
          >
            <TextInput
              placeholder="Contraseña"
              secureTextEntry={visible}
              style={{ width: "80%", height: 60 }}
              placeholderTextColor="#000"
              autoCapitalize="none"
              onChangeText={(val) => setInput({ ...input, password: val })}
            />
            <TouchableOpacity onPress={() => setVisible(!visible)}>
              <Entypo
                name={visible ? "eye-with-line" : "eye"}
                size={25}
                color={Colors.gray}
                style={{ marginRight: 20 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          height={"10%"}
          width={"100%"}
          row
          centerV
          style={{
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text
              text80R
              center
              color={"#E6F8DB"}
              underline
            >
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
          <Text
            text80R
            center
            color={"#E6F8DB"}
            onPress={() => navigation.navigate("UserStepsRegister")}
          >
            Registrarse
          </Text>
        </View>
        <View
          height={"15%"}
          width={"100%"}
          center
        >
          <TouchableWithoutFeedback onPress={() => loginHandle(input)}>
            <View
              height={60}
              width={"80%"}
              backgroundColor="#FA6650"
              centerV
              style={{
                borderRadius: 32,
              }}
            >
              <Text
                center
                text70BO
                color="white"
              >
                Entrar
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
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

const styles = StyleSheet.create({
  textInput: {
    height: 60,
    width: "90%",
    borderRadius: 6,
    paddingLeft: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  }
});
