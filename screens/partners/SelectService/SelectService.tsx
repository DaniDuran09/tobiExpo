import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
} from "react-native";
import { View, Text, TouchableOpacity, Toast } from "react-native-ui-lib";
import AppStorage from "../../../modules/AppStorage";
import ApiFetcher from "../../../modules/ApiFetcher";
import { useNavigation } from "@react-navigation/native";
import RenderPartners from "../../../components/renders/RenderPartners";
import { Colors } from "../../../styles/Colors";

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
      Toast.show("Ha ocurrido un error. Inténtelo de nuevo más tarde.");
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
    <View flex style={{ backgroundColor: Colors.white }}>
      <View row center padding-15>
        {[{ id: 2, label: "Veterinarias" }, { id: 3, label: "Grooming" }].map(({ id, label }) => (
          <TouchableOpacity
            key={id}
            onPress={() => setServiceType(id)}
            style={{
              borderBottomColor: serviceType === id ? Colors.primaryColor : 'transparent',
              borderBottomWidth: 2,
              paddingVertical: 10,
              marginHorizontal: 20,
            }}
          >
            <Text 
              style={{
                color: serviceType === id ? Colors.primaryColor : Colors.gray,
                fontWeight: serviceType === id ? '600' : '500',
                fontSize: 16,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={{ fontSize: 18, color: Colors.gray, marginTop: 20, padding: 15 }}>
        Encontramos estas opciones para ti
      </Text>
      <FlatList
        data={filteredPartners}
        renderItem={({ item }) => <RenderPartners item={item} goToMoreInfo={goToMoreInfo} />}
        keyExtractor={(item) => item.id.toString()}
        style={{ flex: 1, width: "100%" }}
      />
    </View>
  );
};

export default SelectService;
