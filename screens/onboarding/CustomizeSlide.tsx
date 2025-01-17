import { TouchableWithoutFeedback } from "react-native";
import { View, Text } from "react-native-ui-lib";
import { useNavigation } from "@react-navigation/native";
import Description from "./Description";
import Title from "./Title";
import Header from "./Header";

export default function CustomizeSlide() {
  const navigation = useNavigation<any>();
  return (
    <View
    backgroundColor="#EF4136"
    >
      <Header/>
      <View
        style={{
          height: "70%",
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "10%",
        }}
      >
        <Title text="Planes de salud personalizados"/>
        <Description text="Obten un plan de salud personalizado según las necesidades de cada mascota"/>      
      </View>
      <View
        style={{
          height: "10%",
          width: "100%",
          alignItems: "flex-end",
          paddingHorizontal: 20,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <View
            style={{
              height: 50,
              width: "30%",
              backgroundColor: "#000",
              borderRadius: 30,
              justifyContent: "center",
              bottom: "15%",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 15,
                color: "white",
                fontWeight: "700",
              }}
            >
              Registro
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}
