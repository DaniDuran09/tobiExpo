import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../../styles/Colors";
import ServiceList from "../../../components/partners/ServiceList";
import { Text, View } from "react-native-ui-lib";
import ServicesData from "../../../components/partners/ServicesData";
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
        {ServicesData.map(({ type, imageSource, title, subtitle }) => (
          <ServiceList
            key={type}
            imageSource={imageSource}
            title={title}
            subtitle={subtitle}
            onPress={() => goToSelectedScreen(type)}
          />
        ))}
      </View>
    </View>
  );
};

export default PartnersMain;
