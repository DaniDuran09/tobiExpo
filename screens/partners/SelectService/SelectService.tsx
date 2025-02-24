import React, { useEffect, useState, useCallback } from "react";
import { FlatList } from "react-native";
import { View, Text, TouchableOpacity } from "react-native-ui-lib";
import Toast from "react-native-toast-message";
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
      setListPartners(partners.data);
    } catch (error) {
      console.log("error: ", error);
      Toast.show({
        type: "error",
        text1: "Ha ocurrido un error",
        text2: "Inténtelo de nuevo más tarde",
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToMoreInfo = ({ id }: Partner) => {
    navigation.navigate("PartnersGeneralInfo", {
      id: id,
      type: serviceType,
    });
  };

  const filteredPartners = listPartners.filter(({ type_partner }) =>
    serviceType === 2 ? type_partner.id === 2 : type_partner.id !== 2
  );

  return (
    <View flex bg-white>
      <View row center padding-10>
        {[
          { id: 2, label: "Veterinarias" },
          { id: 3, label: "Grooming" },
        ].map(({ id, label }) => (
          <TouchableOpacity
            key={id}
            onPress={() => setServiceType(id)}
            marginH-20
            paddingT-10
            style={{
              borderBottomColor:
                serviceType === id ? Colors.primaryColor : "transparent",
              borderBottomWidth: 2,
            }}
          >
            <Text
              text70BO
              color={serviceType === id ? Colors.primaryColor : Colors.gray}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View paddingB-10 paddingL-10>
        <Text text70 color={Colors.gray} marginT-20>
          Encontramos estas opciones para ti
        </Text>
      </View>
      <FlatList
        data={filteredPartners}
        renderItem={({ item }) => (
          <RenderPartners item={item} goToMoreInfo={goToMoreInfo} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default SelectService;
