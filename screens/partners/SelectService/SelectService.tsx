import React, { useEffect, useState, useCallback } from "react";
import { FlatList } from "react-native";
import { View, Text, TouchableOpacity } from "react-native-ui-lib";
import Toast from "react-native-toast-message";
import ApiFetcher from "../../../modules/ApiFetcher";
import { useNavigation } from "@react-navigation/native";
import RenderPartners from "../../../components/renders/RenderPartners";
import { Colors } from "../../../styles/Colors";
import * as ExpoLocation from 'expo-location';
import { SelectServiceProps, Partner, NavigationService } from "./types";

const SelectService = ({ route }: SelectServiceProps) => {
  const { type, serviceId, petId, q } = route.params;
  const [listPartners, setListPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<ExpoLocation.LocationObjectCoords | null>(null);

  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation<NavigationService>();

  useEffect(() => {
    (async () => {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      try {
        const loc = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced });
        setLocation(loc.coords);
      } catch (e) {
        console.log('Error getting location:', e);
      }
    })();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const partners = await apiFetcher.getPartners({
        q,
        lat: location?.latitude,
        lng: location?.longitude
      });
      setListPartners(partners.data);
    } catch (error) {
      console.log("error: ", error);
      Toast.show({
        type: "error",
        text1: "Ha ocurrido un error",
        text2: "Inténtelo de nuevo más tarde",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [q, location]);

  const goToMoreInfo = (item: Partner) => {
    navigation.navigate("PartnersGeneralInfo", {
      id: item.id,
      type: item.type_partner.id,
      petId,
      serviceId,
      q,
    });
  };


  return (
    <View flex bg-white>
      <View paddingB-10 paddingL-10>
        <Text text70 color={Colors.gray} marginT-20>
          Encontramos estas opciones para ti
        </Text>
      </View>
      <FlatList
        data={listPartners}
        renderItem={({ item }) => (
          <RenderPartners item={item} goToMoreInfo={goToMoreInfo} />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View center marginT-40 paddingH-40>
            <Text gray text70 center>
              {q 
                ? `Actualmente los partners no ofrecen el servicio "${q}".`
                : "No hay partners disponibles."}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default SelectService;
