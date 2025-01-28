import Description from "./Description";
import Layout from "./Layout";
import Title from "./Title";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../styles/Colors";
import { View,Text} from "react-native-ui-lib";
import { TouchableWithoutFeedback } from "react-native";

export default function CustomizeSlide() {
  return (
    <Layout footer={<Footer />}>
      <Title text="Planes de salud personalizados" />
      <Description text="Obten un plan de salud personalizado según las necesidades de cada mascota" />
    </Layout>
  )
}

const Footer = () => {

  const navigation = useNavigation<any>();
  return (
    <View marginB-20 right style={{ marginTop: "auto" }}>
      <TouchableWithoutFeedback onPress={() => { navigation.navigate("LoginScreen") }}>
        <View backgroundColor={Colors.black} paddingV-15 paddingH-30 br100>
          <Text 
            center
            text70BO
            color={Colors.white}
          >Registro</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>

  )
}