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
      <Title text="Di adiós a las llamadas pidiendo registros de vacunación." />
      <Description text="Accede y comparte los registros de salud de tu mascota fácilmente, cuando lo necesites." />
    </Layout>
  )
}

const Footer = () => {

  const navigation = useNavigation<any>();
  return (
    <View padding-20 absB absR>
      <TouchableWithoutFeedback onPress={() => { navigation.navigate("LoginScreen") }}>
        <View backgroundColor={Colors.black} paddingV-15 paddingH-40 br100>
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