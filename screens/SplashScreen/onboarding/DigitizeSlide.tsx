import Description from "./Description";
import Title from "./Title";
import Layout from "./Layout";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "react-native-ui-lib";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Colors } from "../../../styles/Colors";
import MicroText from "./MicroText";

export default function DigitalizeSlide() {
  return (
    <Layout footer={<Footer/>}>
      <Title text="Porque cuidar de quien amas también se planea." />
      <Description text="Tobi te envía recordatorios de vacunas y desparasitaciones para que tu mascota siempre esté protegida, y tú puedas estar en paz." />
      <MicroText text="Evita el susto. Llega a tiempo." />
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