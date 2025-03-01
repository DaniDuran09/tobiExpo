import {FlatList } from "react-native";
import React from "react";
import { Button, Text, View } from "react-native-ui-lib";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import activitiesData from "../../../utils/data/activitiesData";
import renderActivityItem from "../../../components/renders/RenderActivityItem";
import { RootStackParamList } from "./types";

interface BottomMenuProps {
  disabledOption?: boolean;
}

type BottomMenuNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RegisterNewPet"
>;

const BottomMenu = ({ disabledOption = false }: BottomMenuProps) => {
  const navigation = useNavigation<BottomMenuNavigationProp>();

  const addNewPet = () => {
    navigation.navigate("RegisterNewPet");
  };

  const screenNavigate = (screenName: keyof RootStackParamList) => {
    navigation.navigate(screenName);
  };

  return (
    <View flex bg-white paddingH-10 left width='100%'>
      <Button label="+ Mascotas" onPress={addNewPet} link black />
      <View  marginT-2>
        <Text text70BO black>
          MI ACTIVIDAD
        </Text>
      </View>
      <FlatList
        data={activitiesData}
        renderItem={({ item }) =>
          renderActivityItem({ item, disabledOption, screenNavigate })
        }
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default BottomMenu;
