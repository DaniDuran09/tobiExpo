import React, { useEffect, useRef, useCallback, useState } from "react";
import { Dimensions } from "react-native";
import { View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { StackScreenProps } from "@react-navigation/stack";
import { setUserInfo } from "../redux/slice/userSlice";
import AppStorage from "../modules/AppStorage";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../styles/Colors";
import {
  Extrapolation,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";
import HealthSlide from "./onboarding/HealthSlide";
import DigitalizeSlide from "./onboarding/DigitizeSlide";
import CustomizeSlide from "./onboarding/CustomizeSlide";

const { width, height } = Dimensions.get("window");

type SplashScreenProps = StackScreenProps<any>;

const SplashScreen = ({ navigation }: SplashScreenProps) => {
  const [token, setToken] = useState<string | null>(null);
  const dispatch = useDispatch();
  const progress = useSharedValue(0);
  const carouselRef = useRef<ICarouselInstance>(null);
  const appStorage = useRef(new AppStorage()).current;

  useEffect(() => {
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
        console.error("Error en el splash: ", error);
      }
    };
    fetchData();
  }, [navigation, dispatch, appStorage]);

  const onPressPagination = useCallback((index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.danger }}>
      <View flex>
        <Carousel
          ref={carouselRef}
          width={width}
          height={height * 0.85}
          loop
          vertical={false}
          onProgressChange={progress}
          style={{ width: "100%", height: "100%" }}
          data={[<HealthSlide />, <DigitalizeSlide />, <CustomizeSlide />]}
          renderItem={({ item }) => item}
        />
        <Pagination.Custom
          progress={progress}
          data={[{ color: "#B0604D" }, { color: "#899F9C" }, { color: "#B3C680" }]}
          size={15}
          dotStyle={{ borderRadius: 14, backgroundColor: "#F0AF96" }}
          activeDotStyle={{
            borderRadius: 8,
            width: 80,
            height: 15,
            backgroundColor: "#f1f1f1",
          }}
          containerStyle={{
            gap: 6,
            padding: 20,
            position: "absolute",
            bottom: height * 0.04,
            alignSelf: "center",
          }}
          onPress={onPressPagination}
          customReanimatedStyle={(progress, index, length) => {
            let val = Math.abs(progress - index);
            if (index === 0 && progress > length - 1) {
              val = Math.abs(progress - length);
            }
            return {
              transform: [
                {
                  translateY: interpolate(val, [0, 1], [0, 0], Extrapolation.CLAMP),
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
