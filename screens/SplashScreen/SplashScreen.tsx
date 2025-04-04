import React, { useEffect, useRef, useCallback, useState } from "react";
import { Dimensions } from "react-native";
import { View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { StackScreenProps } from "@react-navigation/stack";
import { setUserInfo } from "../../redux/slice/userSlice";
import AppStorage from "../../modules/AppStorage";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para almacenar datos
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../styles/Colors";
import { useSharedValue } from "react-native-reanimated";
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
    const checkOnboarding = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
        if (hasSeenOnboarding) {
          navigation.replace("LoginScreen");
          return;
        }

        const response = await appStorage.getAppToken();
        const user = await appStorage.getUser();
        if (response && user) {
          setToken(response);
          dispatch(setUserInfo(user));
          navigation.replace("Home");
        }
      } catch (error) {
        console.error("Error en el splash: ", error);
      }
    };
    checkOnboarding();
  }, [navigation, dispatch, appStorage]);

  const onPressPagination = useCallback((index: number) => {
    carouselRef.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.danger }}>
      <View style={{ flex: 1 }}>
        <Carousel
          ref={carouselRef}
          width={width}
          height={height}
          onProgressChange={progress}
          data={[<HealthSlide />, <DigitalizeSlide />, <CustomizeSlide />]}
          renderItem={({ item }) => item}
        />
        <Pagination.Custom
          progress={progress}
          data={[
            { color: Colors.danger },
            { color: Colors.danger },
            { color: Colors.danger },
          ]}
          size={15}
          dotStyle={{ borderRadius: 14, backgroundColor: Colors.mediumGray }}
          activeDotStyle={{
            borderRadius: 8,
            width: 80,
            height: 15,
            backgroundColor: Colors.white,
          }}
          containerStyle={{
            position: "absolute",
            bottom: 0,
            left: 20,
            alignItems: "flex-start",
            gap: 10,
            padding: 20,
          }}
          onPress={onPressPagination}
        />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
