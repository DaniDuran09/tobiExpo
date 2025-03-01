import { TouchableOpacity, Image, View, FlatList, StyleSheet } from "react-native";
import React from "react";
import { Text } from "react-native-ui-lib";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import activitiesData from "../../../utils/data/activitiesData"; // Importa las actividades
import renderActivityItem from "../../../components/renders/RenderActivityItem";
import { RootStackParamList } from "./types"; // Importamos el componente

interface BottomMenuProps {
  disabledOption?: boolean;
}

type BottomMenuNavigationProp = StackNavigationProp<RootStackParamList, 'RegisterNewPet'>;

const BottomMenu = ({ disabledOption = false }: BottomMenuProps) => {
  const navigation = useNavigation<BottomMenuNavigationProp>();

  const addNewPet = () => {
    navigation.navigate("RegisterNewPet");
  };

  const screenNavigate = (screenName: keyof RootStackParamList) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={addNewPet}>
        <Text marginT-5>+ Mascotas</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text text70BO black marginT-5>
          MI ACTIVIDAD
        </Text>
      </View>

      <FlatList
        data={activitiesData}  // Usamos activitiesData importado
        renderItem={({ item }) => renderActivityItem({ item, disabledOption, screenNavigate })}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default BottomMenu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "33%",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  section: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Aquí debe ser "center" y no "string"
    paddingVertical: 10,
  },
  image: { height: 20, width: 20, marginRight: 10 },
  text: {
    flex: 1,
    fontWeight: "bold",
  },
  arrowImage: { height: 15, width: 15 },
  separator: {
    height: 1,
    backgroundColor: "grey",
    marginVertical: 10,
  },
});
