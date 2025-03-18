import React, { useEffect, useRef, useCallback } from "react";
import { Dimensions } from "react-native";
import { View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/slice/userSlice";
import AppStorage from "../modules/AppStorage";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Extrapolation,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";
import HealthSlide from "./onboarding/HealthSlide";
import DigitalizeSlide from "./onboarding/DigitizeSlide";
import CustomizeSlide from "./onboarding/CustomizeSlide";
import { Colors } from "../styles/Colors";

type NavigationProps = StackScreenProps<any>;

const { width, height } = Dimensions.get("window");

const SLIDES = [<HealthSlide />, <DigitalizeSlide />, <CustomizeSlide />];

const SplashScreen = ({ navigation }: NavigationProps) => {
  const dispatch = useDispatch();
  const progress = useSharedValue(0);
  const carouselRef = useRef<ICarouselInstance>(null);
  const appStorage = new AppStorage();

  const fetchData = useCallback(async () => {
    try {
      const token = await appStorage.getAppToken();
      const user = await appStorage.getUser();
      if (token && user) {
        dispatch(setUserInfo(user));
        navigation.replace("Home");
      }
    } catch (error) {
      console.error("Error en el Splash:", error);
    }
  }, [dispatch, navigation]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.danger }}>
      <View flex>
        <Carousel
          ref={carouselRef}
          width={width}
          height={height * 0.85}
          loop
          onProgressChange={progress}
          style={{ width: "100%", height: "100%" }}
          data={SLIDES}
          renderItem={({ item }) => item}
        />

        <Pagination.Custom
          progress={progress}
          data={[{}, {}, {}]}
          size={15}
          dotStyle={{
            borderRadius: 14,
            backgroundColor: "#F0AF96",
          }}
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
