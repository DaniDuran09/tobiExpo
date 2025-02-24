import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../../styles/Colors";
import ServiceList from "../../../components/partners/ServiceList";
import { Text, View } from "react-native-ui-lib";

const PartnersMain = () => {
  const navigation = useNavigation<NavigationType>();

  const goToSelectedScreen = (type: number) => {
    navigation.navigate("SelectService", { type });
  };

  return (
    <View padding-s4 bg-white center>
      <Text text70 color={Colors.gray} marginT-s2>
        Aquí encontrarás tus servicios favoritos
      </Text>

      <View center marginT-s1>
        <ServiceList
          imageSource={require("../../../assets/vetBackground.png")}
          title="Veterinarios"
          subtitle="Certificados"
          onPress={() => goToSelectedScreen(2)}
        />
        <ServiceList
          imageSource={require("../../../assets/groomingBackground.png")}
          title="Grooming"
          subtitle="Spa, baños y estética"
          onPress={() => goToSelectedScreen(3)}
        />
      </View>
    </View>
  );
};

export default PartnersMain;
