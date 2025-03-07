import { FlatList } from "react-native";
import React from "react";
import { Button, Text, View } from "react-native-ui-lib";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import activitiesData from "../../../utils/data/activitiesData";
import RenderActivityItem from "../../../components/renders/RenderActivityItem";

type BottomMenuNavigationProp = StackNavigationProp<any, "RegisterNewPet">;

const BottomMenu = ({
  disabledOption = false,
}: {
  disabledOption?: boolean;
}) => {
  const navigation = useNavigation<BottomMenuNavigationProp>();

  const addNewPet = () => {
    navigation.navigate("RegisterNewPet", {});
  };

  const screenNavigate = (screenName: string) => {
    navigation.navigate(screenName, {});
  };

  return (
    <View flex bg-white paddingH-10 left width="100%">
      <Button label="+ Mascotas" onPress={addNewPet} link black />
      <View marginT-2>
        <Text text70BO black>
          MI ACTIVIDAD
        </Text>
      </View>
      <FlatList
        data={activitiesData}
        renderItem={({ item }) => {
          const { imageSource, title, screen } = item;
          return (
            <View>
              <RenderActivityItem
                imageSource={imageSource}
                title={title}
                screen={screen}
                disabledOption={disabledOption}
                screenNavigate={screenNavigate}
              />
              <View height={1} width="100%" bg-grey10 marginV-2 />
            </View>
          );
        }}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default BottomMenu;
