import React, { useEffect, useState } from "react";
import AppStorage from "../modules/AppStorage";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/slice/userSlice";
import HealthSlide from "./onboarding/HealthSlide";
import DigitalizeSlide from "./onboarding/DigitizeSlide";
import CustomizeSlide from "./onboarding/CustomizeSlide";
import { Carousel } from "react-native-ui-lib";

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
    <Carousel pageControlPosition={Carousel.pageControlPositions.OVER}>
      <HealthSlide/>
      <DigitalizeSlide/>
      <CustomizeSlide/>
    </Carousel>
  );
};

export default SplashScreen;