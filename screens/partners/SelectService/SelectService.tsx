// SelectService/SelectService.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { Colors } from "../../../styles/Colors";
import AppStorage from "../../../modules/AppStorage";
import ApiFetcher from "../../../modules/ApiFetcher";
import { useNavigation } from "@react-navigation/native";
import RenderPartners from "../../../components/renders/RenderPartners";
const SelectService = ({ route }: SelectServiceProps) => {
  const { type } = route.params;
  const [listPartners, setListPartners] = useState<Partner[]>([]);
  const [serviceType, setServiceType] = useState<number>(type || 2);
  
  const appStorage = new AppStorage();
  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation<NavigationType>();

  const fetchData = useCallback(async () => {
    try {
      await appStorage.getAppToken(); 
      const partners = await apiFetcher.getPartners();
      if ([200, 201].includes(partners.code)) {
        setListPartners(partners.data);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
      Alert.alert("Ha ocurrido un error", "Inténtelo de nuevo más tarde");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToMoreInfo = (item: Partner) => {
    navigation.navigate("PartnersGeneralInfo", { id: item.id, type: serviceType });
  };

  const filteredPartners = listPartners.filter((partner) =>
    serviceType === 2 ? partner.type_partner.id === 2 : partner.type_partner.id !== 2
  );

  return (
    <View style={styles.container}>
      <View style={styles.selectContainer}>
        {[{ id: 2, label: "Veterinarias" }, { id: 3, label: "Grooming" }].map(({ id, label }) => (
          <TouchableOpacity
            key={id}
            style={serviceType === id ? styles.optionSelected : null}
            onPress={() => setServiceType(id)}
          >
            <Text style={serviceType === id ? styles.selected : styles.notSelected}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.textOptionsForYou}>Encontramos estas opciones para ti</Text>
      <FlatList
        data={filteredPartners}
        renderItem={({ item }) => <RenderPartners item={item} goToMoreInfo={goToMoreInfo} />}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    padding: 15,
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
    marginTop: 20,
    padding: 15,
  },
  flatList: {
    flex: 1,
    width: "100%",
  },
});

export default SelectService;
