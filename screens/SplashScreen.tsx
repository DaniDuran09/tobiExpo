import React, { useEffect, useState } from "react";
import AppStorage from "../modules/AppStorage";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/slice/userSlice";
import HealthSlide from "./onboarding/HealthSlide";
import DigitalizeSlide from "./onboarding/DigitizeSlide";
import CustomizeSlide from "./onboarding/CustomizeSlide";
import { Carousel } from "react-native-ui-lib";
import { StackScreenProps } from "@react-navigation/stack";
import { Colors } from "../styles/Colors";

type NavigationProps = StackScreenProps<any>

const SplashScreen = ({ navigation }: NavigationProps) => {
  const [token, setToken] = useState(null);
  const appStorage = new AppStorage();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await appStorage.getAppToken();
      const user = await appStorage.getUser();
      if (response && user) {
        setToken(response);
        dispatch(setUserInfo(user));
        navigation.navigate("Home");
      }
    } catch (error) {
      console.log("Error en el splash: ", error);
    }
  };

  return (
    <Carousel containerStyle={{flex:1,backgroundColor:Colors.danger}} pageControlPosition={Carousel.pageControlPositions.OVER}>
      <HealthSlide />
      <DigitalizeSlide />
      <CustomizeSlide />     
    </Carousel>
  );
};

export default SplashScreen;