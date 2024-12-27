import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

import Swiper from "react-native-swiper";
import AppStorage from "../modules/AppStorage";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../redux/slice/userSlice";

const SplashScreen = ({ navigation }) => {
  const [token, setToken] = useState(null);
  const appStorage = new AppStorage();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log("Entro al fetchdata");
    try {
      console.log("Hasta aqui todo bien");
      const response = await appStorage.getAppToken();
      const user = await appStorage.getUser();
      console.log("Lo que intento traer: ", response, user);
      if (response && user) {
        console.log("No entro aqui?");
        setToken(response);
        dispatch(setUserInfo(user));
        navigation.navigate("Home");
      } else {
        console.log("No entro aqui, no hago nada");
      }
    } catch (error) {
      console.log("Error en el splash: ", error);
    }
  };

  return (
    <Swiper showsButtons={false}>
      <View
        style={{
          backgroundColor: "#EF4136", //#E6F8DB
        }}
      >
        <View
          style={{
            height: "20%",
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            paddingLeft: 20,
          }}
        >
          <Image
            source={require("../assets/Logo.png")}
            style={{ height: 70, width: 200 }}
            resizeMode={"contain"}
          />
        </View>
        <View
          style={{
            height: "80%",
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: "10%",
          }}
        >
          <View style={{ width: "80%" }}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                textAlign: "left",
                color: "#E6F8DB",
                fontFamily: Platform.OS === "android" ? "Poppins" : null,
              }}
            >
              Salud y bienestar
            </Text>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                textAlign: "left",
                color: "#E6F8DB",
              }}
            >
              para tu mascota en
            </Text>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                textAlign: "left",
                color: "#E6F8DB",
              }}
            >
              un solo lugar
            </Text>
          </View>
          <View style={{ width: "80%", paddingTop: "10%" }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "400",
                textAlign: "left",
                color: "#E6F8DB",
                fontFamily: Platform.OS === "android" ? "Poppins" : null,
              }}
            >
              los mejores productos,
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "400",
                textAlign: "left",
                color: "#E6F8DB",
              }}
            >
              servicios y especialistas
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#EF4136", //#E6F8DB
        }}
      >
        <View
          style={{
            height: "20%",
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            paddingLeft: 20,
          }}
        >
          <Image
            source={require("../assets/Logo.png")}
            style={{ height: 70, width: 200 }}
            resizeMode={"contain"}
          />
        </View>
        <View
          style={{
            height: "80%",
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: "10%",
          }}
        >
          <View style={{ width: "80%" }}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                textAlign: "left",
                color: "#E6F8DB",
                fontFamily: Platform.OS === "android" ? "Poppins" : null,
              }}
            >
              Digitaliza la cartilla de vacunación de tu mascota
            </Text>
          </View>
          <View style={{ width: "80%", paddingTop: "10%"}}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "400",
                textAlign: "left",
                color: "#E6F8DB",
                fontFamily: Platform.OS === "android" ? "Poppins" : null,
              }}
            >
              Llévala siempre contigo, de manera digital y segura
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "#EF4136", //#E6F8DB
        }}
      >
        <View
          style={{
            height: "20%",
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            paddingLeft: 20,
          }}
        >
          <Image
            source={require("../assets/Logo.png")}
            style={{ height: 70, width: 200 }}
            resizeMode={"contain"}
          />
        </View>
        <View
          style={{
            height: "70%",
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: "10%",
          }}
        >
          <View style={{ width: "80%" }}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                textAlign: "left",
                color: "#E6F8DB",
                fontFamily: Platform.OS === "android" ? "Poppins" : null,
              }}
            >
             Planes de salud personalizados 
            </Text>
            
          </View>
          <View style={{ width: "80%", paddingTop: "10%" }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "400",
                textAlign: "left",
                color: "#E6F8DB",
                fontFamily: Platform.OS === "android" ? "Poppins" : null,
              }}
            >
              Obten un plan de salud personalizado según las necesidades de cada mascota
            </Text>
          </View>
        </View>
        <View
          style={{
            height: "10%",
            width: "100%",
            alignItems: "flex-end",
            paddingHorizontal: 20,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("LoginScreen")}
          >
            <View
              style={{
                height: 50,
                width: "30%",
                backgroundColor: "#000",
                borderRadius: 30,
                justifyContent: "center",
                bottom: "15%",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "white",
                  fontWeight: "700",
                }}
              >
                Registro
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Swiper>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});
