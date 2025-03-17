import React, { useEffect, useState } from "react";
import AppStorage from "../modules/AppStorage";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/slice/userSlice";
import HealthSlide from "./onboarding/HealthSlide";
import DigitalizeSlide from "./onboarding/DigitizeSlide";
import CustomizeSlide from "./onboarding/CustomizeSlide";
import { View } from "react-native";
import {
  Extrapolation,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { StackScreenProps } from "@react-navigation/stack";
import { Colors } from "../styles/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

type NavigationProps = StackScreenProps<any>;

const SplashScreen = ({ navigation }: NavigationProps) => {
  const [token, setToken] = useState(null);
  const appStorage = new AppStorage();
  const dispatch = useDispatch();
  const progress = useSharedValue(0); // Valor compartido para el progreso de la paginación

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

  const baseOptions = {
    vertical: false,
    width: 430, // Puedes ajustar el ancho del carrusel
    height: 500 , // Puedes ajustar la altura del carrusel
  };

  const ref = React.useRef<ICarouselInstance>(null);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.danger }}>
      <View style={{ flex: 1 }}>
        <Carousel
          ref={ref}
          {...baseOptions}
          loop
          onProgressChange={progress}
          style={{ width: '100%', height:'90%' }}
          data={[<HealthSlide />, <DigitalizeSlide />, <CustomizeSlide />]}
          renderItem={({ item }) => item} // Aquí renderizas las diapositivas
        />

        {/* Paginación personalizada */}
        <Pagination.Custom
          progress={progress}
          data={[{ color: "#B0604D" }, { color: "#899F9C" }, { color: "#B3C680" }]} // Ejemplo de datos para los puntos
          size={20}
          dotStyle={{
            borderRadius: 16,
            backgroundColor: "#262626",
          }}
          activeDotStyle={{
            borderRadius: 8,
            width: 40,
            height: 30,
            overflow: "hidden",
            backgroundColor: "#f1f1f1",
          }}
          containerStyle={{
            gap: 5,
            alignItems: "center",
            marginBottom: 20,
            height: 10,
          }}
          horizontal
          onPress={onPressPagination}
          customReanimatedStyle={(progress, index, length) => {
            let val = Math.abs(progress - index);
            if (index === 0 && progress > length - 1) {
              val = Math.abs(progress - length);
            }
            return {
              transform: [
                {
                  translateY: interpolate(
                    val,
                    [0, 1],
                    [0, 0],
                    Extrapolation.CLAMP
                  ),
                },
              ],
            };
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
