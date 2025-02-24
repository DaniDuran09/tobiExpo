import React from "react";

import { FlatList } from "react-native";
import { Text, View } from "react-native-ui-lib";

import { useNavigation } from "@react-navigation/native";

import { Colors } from "../../../styles/Colors";
import ServiceList from "../../../components/partners/ServiceList";
import servicesData from "../../../utils/data/servicesData";

const PartnersMain = () => {
  const navigation = useNavigation<NavigationType>();

  const goToSelectedScreen = (type: number) => {
    navigation.navigate("SelectService", { type });
  };

  return (
    <View flex padding-s4 bg-white>
      <View center marginT-s1>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={servicesData}
          ListHeaderComponent={() => (
            <Text text70 color={Colors.gray} marginT-s2 center>
              Aquí encontrarás tus servicios favoritos
            </Text>
          )}
          renderItem={({ item }) => (
            <ServiceList
              key={item.type}
              imageSource={item.imageSource}
              title={item.title}
              subtitle={item.subtitle}
              onPress={() => goToSelectedScreen(item.type)}
            />
          )}
        />
      </View>
    </View>
  );
};

export default PartnersMain;
