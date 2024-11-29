import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../styles/Colors";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { setServiceInfo } from "../../redux/slice/appointmentSlice";

const ListPartners = ({ route }) => {
  const { partnerId, partnerLocation, partners,services, action, vaccine } = route.params;
  const [loading, setLoading] = useState(true);
  
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const goToCreateDate = (specialist) => {
    navigation.navigate("InfoServiceForDate", {
      partnerId: partnerId,
      partnerLocation: partnerLocation,
      specialist: specialist
    });
    dispatch(setServiceInfo(services));
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        style={styles.elevation}
        onPress={() =>
          action
            ? action(item.name, vaccine)
            : goToCreateDate(item)

        }
      >
        <Image
          source={{ uri: item.picture }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text>{item.name}</Text>
          <Text>
            MVZ con especialidad en Cirugía interna para razas pequeñas. Perros
            y gatos.
          </Text>
          <Text>Céd. Prof. 123456</Text>
        </View>
        <Image
          source={require(".././../assets/arrowRigth.png")}
          style={styles.arrow}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Veterinarios</Text>
      <FlatList
        keyExtractor={(item, index) => `item-${index}`}
        data={partners}
        //   refreshControl={
        //     <RefreshControl
        //       //refresh control used for the Pull to Refresh
        //       refreshing={loading}
        //     //   onRefresh={blog}
        //     />
        //   }
        renderItem={({ item }) => renderItem(item)}
        style={{ height: "100%" }}
      />
    </View>
  );
};

export default ListPartners;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  title: {
    padding: 15,
    fontSize: 18,
    fontWeight: "800",
  },
  elevation: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 100,
  },
  infoContainer: {
    width: "70%",
  },
  arrow: {
    width: 20,
    height: 20,
  },
});
