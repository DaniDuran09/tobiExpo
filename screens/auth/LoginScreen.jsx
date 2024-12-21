import React from "react";
import {
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import AppStorage from "../../modules/AppStorage";
import { setUserInfo } from "../../redux/slice/userSlice";
import Entypo from "react-native-vector-icons/Entypo";
import { Colors } from "../../styles/Colors";
import Loading from "../../components/Loading";
import ApiFetcher from "../../modules/ApiFetcher";
import Toast from "react-native-toast-message";
import { View,Image,Text } from "react-native-ui-lib";

const LoginScreen = ({ navigation }) => {
  const [data, setData] = React.useState({
    username: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });
  const [input, setInput] = React.useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(true);

  const appStorage = new AppStorage();
  const apiFetcher = new ApiFetcher();
  const dispatch = useDispatch();

  const textInputChange = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleValidUser = (val) => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        isValidUser: false,
      });
    }
  };

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
        height={height/1}
        width={width}
        backgroundColor="#EF4136"       
      >
        {/* <Loader active={loading} /> */}
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
              //elevation={5}
              style={{width:"80%",height:60}}
              placeholderTextColor="#000"
              autoCapitalize="none"
              onChangeText={(val) => setInput({ ...input, password: val })}
            />
            <TouchableOpacity onPress={() => setVisible(!visible)}>
              <Entypo
                name={visible ? "eye-with-line" : "eye"}
                size={25}
                color={Colors.gray}              
                style={{marginRight: 20}}
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
          <TouchableOpacity onPress={()=>navigation.navigate("ForgotPassword")}>
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
          {/* <Image
              source={require("../assets/huella_w.png")}
              style={{ height: 45, width: 45 }}
              resizeMode={"contain"}
            /> */}
          <View style={{ position: "absolute", bottom: "20%", left: "20%" }}>
            <Text              
              center
              color={"#E6F8DB"}
              style={{fontSize:14,fontWeight:300}}
            >
              Al registrarse, aceptas el
            </Text>
            <Text              
              center
              color={"#E6F8DB"}      
              style={{fontSize:14,fontWeight:300}}
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
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
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
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  passwordStyles: {
    width: "80%",
    height: 60,
  },
});
