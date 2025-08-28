import Description from "./Description";
import Layout from "./Layout";
import Title from "./Title";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../../styles/Colors";
import { View, Text } from "react-native-ui-lib";
import { TouchableWithoutFeedback } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import MicroText from "./MicroText";

export default function CustomizeSlide() {
  return (
    <Layout footer={<Footer />} >
      <Title text="Su historial de salud, listo para lo que venga." />
      <Description text="Comparte con un clic sus registros de vacunas y cuidados. Desde el veterinario hasta la guardería, Tobi está contigo." />
      <MicroText text="Descárgalo. Compártelo. Listo."/>
    </Layout>
  );
}

const Footer = () => {
  const navigation = useNavigation<any>();

  const handleRegisterPress = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true"); 
      navigation.replace("LoginScreen"); 
    } catch (error) {
      console.error("Error al guardar el estado del onboarding:", error);
    }
  };

  return (
    <View paddingV-50 paddingR-20>
      <TouchableWithoutFeedback onPress={handleRegisterPress}>
        <View backgroundColor={Colors.black} paddingV-15 paddingH-25 br100>
          <Text center text70BO color={Colors.white}>
            Registro
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
