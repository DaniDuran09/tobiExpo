import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { Colors } from "../../styles/Colors";
import AppStorage from "../../modules/AppStorage";
import { getPartens } from "../../services";
import { useNavigation } from "@react-navigation/native";
import ApiFetcher from "../../modules/ApiFetcher";
import { AnimatedImage, LoaderScreen, SkeletonView } from "react-native-ui-lib";

const SelectService = ({ route }) => {
  const { type } = route.params;
  const [listPartners, setListPartners] = useState([]);
  const [serviceType, setServiceType] = useState(2);

  const appStorage = new AppStorage();
  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation();

  useEffect(() => {
    setServiceType(type);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await appStorage.getAppToken();
      const partners = await apiFetcher.getPartners();
      if (partners.code == 200 || partners.code == 201)
        setListPartners(partners.data);
    } catch (error) {
      console.log("Error: ", error);
      Alert.alert("Ha ocurrido un error", "Inténtelo de nuevo más tarde");
    }
  };

  const goToMoreInfo = (item, type) => {
    navigation.navigate("PartnersGeneralInfo", { id: item.id, type: type });
  };

  const renderPartners = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => goToMoreInfo(item, serviceType)}
    >
      <View style={styles.leftSection}>
        <AnimatedImage
          source={{ uri: item?.picture }}
          style={styles.imageItem}
          loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
          animationDuration={500}
          resizeMode="contain"
        />
      </View>
      <View style={styles.RightSection}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.type_partner.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredPartners =
    serviceType === 2
      ? listPartners.filter((partner) => partner.type_partner.id === 2)
      : listPartners.filter((partner) => partner.type_partner.id !== 2);

  return (
    <View style={styles.container}>
      <View style={styles.selectContainer}>
        <TouchableOpacity
          style={serviceType === 2 ? styles.optionSelected : {}}
          onPress={() => setServiceType(2)}
        >
          <Text
            style={serviceType === 2 ? styles.selected : styles.notSelected}
          >
            Veterinarias
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={serviceType != 2 ? styles.optionSelected : {}}
          onPress={() => setServiceType(3)}
        >
          <Text style={serviceType != 2 ? styles.selected : styles.notSelected}>
            Grooming
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.textOptionsForYou}>
          Encontramos estas opciones para ti
        </Text>
      </View>
      <View style={styles.partnersContainer}>
        <FlatList
              data={filteredPartners}
              renderItem={renderPartners}
              keyExtractor={(item) => item.id.toString()} // Use toString() para asegurar que sea una cadena
              style={styles.flatList}
            />
      </View>
    </View>
  );
};

export default SelectService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  selectContainer: {
    justifyContent: "center",
    flexDirection: "row",
    gap: 40,
    padding: 15,
    paddingBottom: 0,
  },
  selected: {
    color: Colors.primaryColor,
    fontWeight: "600",
    fontSize: 16,
  },
  notSelected: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.gray,
  },
  optionSelected: {
    borderBottomColor: Colors.primaryColor,
    borderBottomWidth: 2,
  },
  textOptionsForYou: {
    fontSize: 18,
    color: Colors.gray,
  },
  textContainer: {
    marginTop: 20,
    padding: 15,
    paddingBottom: 0,
  },
  partnersContainer: {
    marginTop: 30,
    paddingBottom: 120,
  },
  item: {
    height: 130,
    paddingLeft: 15,
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    alignItems: "center",
    shadowColor: Colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom: 10,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
  leftSection: {
    width: "50%",
  },
  imageItem: {
    height: 90,
    width: 90,
    borderRadius: 11,
  },
  RightSection: {
    paddingRight: 15,
  },
  itemDescription: {
    fontSize: 15,
    marginTop: 5,
    color: Colors.gray,
  },
});
