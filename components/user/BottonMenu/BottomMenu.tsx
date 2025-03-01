import { StyleSheet, TouchableOpacity, View, Image, FlatList } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native-ui-lib";
import { StackNavigationProp } from "@react-navigation/stack";

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

  const items = [
    {
      label: "Id. digital de mi mascota",
      screen: "IdMyPet",
      icon: require("../../../assets/qr.png"),
    },
    {
      label: "Mis citas",
      screen: "Appointments",
      icon: require("../../../assets/calendar.png"),
    },
    {
      label: "Historial",
      screen: "History",
      icon: require("../../../assets/bag.png"),
    },
    {
      label: "Cartilla de salud digitalizada",
      screen: "SelectPetVaccines",
      icon: require("../../../assets/images/cartilla-icon.png"),
    },
  ];

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      disabled={disabledOption}
      onPress={() => screenNavigate(item.screen)}
      style={[styles.section, disabledOption && { opacity: 0.5 }]}
    >
      <Image source={item.icon} style={styles.image} resizeMode={"contain"} />
      <Text text70BO black style={styles.text}>
        {item.label}
      </Text>
      <Image
        source={require("../../../assets/arrowRigth.png")}
        style={styles.arrowImage}
        resizeMode={"contain"}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={addNewPet}>
        <Text marginT-5>+ Mascotas</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text text70BO black marginT-5 marginB-5>
          MI ACTIVIDAD
        </Text>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
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
    height: 45, // Ajustado el tamaño de la sección
    width: "100%",
    flexDirection: "row", // Alineación en fila
    justifyContent: "space-between", // Distribuye los elementos
    alignItems: "center", // Centrado vertical
    paddingVertical: 10,
  },
  image: { height: 20, width: 20, marginRight: 15 }, // Espaciado entre ícono y texto
  text: {
    flex: 1, // El texto ocupará el espacio restante
    fontWeight: "bold",
  },
  arrowImage: { height: 15, width: 15 },
  separator: {
    height: 1,
    backgroundColor: "grey", // Separador entre los ítems
    marginVertical: 10,
  },
});
