import React, { useEffect, useState, useCallback } from "react";
import { FlatList } from "react-native";
import { View, Text, TouchableOpacity, TextField } from "react-native-ui-lib";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import ApiFetcher from "../../../modules/ApiFetcher";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import RenderPartners from "../../../components/renders/RenderPartners";
import { Colors } from "../../../styles/Colors";
import * as ExpoLocation from 'expo-location';
import { SelectServiceProps, Partner, NavigationService } from "./types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SelectService = ({ route }: SelectServiceProps) => {
  const params = route?.params || {};
  const { type, serviceId, petId, q: initialQ, service_catalog_id, catalog_code, vaccine_id } = params;

  console.log("SelectService params recibidos:", params);

  // Consideramos que trae parámetros si al menos uno de los relevantes tiene un valor válido
  const hasParams = (type !== undefined && type !== null) ||
    (serviceId !== undefined && serviceId !== null) ||
    (petId !== undefined && petId !== null) ||
    (initialQ !== undefined && initialQ !== null && initialQ !== '') ||
    (service_catalog_id !== undefined && service_catalog_id !== null) ||
    (catalog_code !== undefined && catalog_code !== null) ||
    (vaccine_id !== undefined && vaccine_id !== null);

  const [listPartners, setListPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<ExpoLocation.LocationObjectCoords | null>(null);
  const [q, setQ] = useState(initialQ || '');
  const [searchInput, setSearchInput] = useState(initialQ || '');
  const [categories, setCategories] = useState<any[]>([]);

  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation<NavigationService>();

  // Sincronizar estado cuando los params cambian (navegar desde Home con diferente servicio)
  useFocusEffect(
    useCallback(() => {
      const newQ = route?.params?.q || '';
      setQ(newQ);
      setSearchInput(newQ);
      setListPartners([]);
    }, [route?.params?.q, route?.params?.serviceId, route?.params?.petId])
  );

  // Synchronize route.params changes to state when receiving new params
  useEffect(() => {
    setQ(initialQ || '');
    setSearchInput(initialQ || '');
  }, [initialQ, service_catalog_id, catalog_code, vaccine_id]);

  useEffect(() => {
    if (!hasParams) {
      apiFetcher.getServiceCategories()
        .then(res => {
          if (res && res.data) {
            setCategories(res.data.slice(0, 6));
          }
        })
        .catch(err => console.log("Error categories:", err));
    }
  }, [hasParams]);

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
        //lat: location?.latitude,
        //lng: location?.longitude,
        service_catalog_id,
        catalog_code,
        vaccine_id
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
  }, [q, location, service_catalog_id, catalog_code, vaccine_id]);

  const goToMoreInfo = (item: Partner) => {
    navigation.navigate("PartnersGeneralInfo", {
      id: item.id,
      type: item.type_partner.id,
      petId,
      serviceId,
      q,
      service_catalog_id,
      catalog_code,
      vaccine_id
    });
  };

  const handleSearch = () => {
    setQ(searchInput);
  };

  const handlePillClick = (categoryName: string) => {
    setSearchInput(categoryName);
    setQ(categoryName);
  };


  const isFromNotification = !!(service_catalog_id || catalog_code || vaccine_id || q);
  const serviceName = q || initialQ || "";

  let serviceDescription = "Te sugerimos agendar este servicio para mantener la salud de tu mascota.";
  let serviceStatus = "Recomendado";
  let serviceCategory = "Servicio sugerido";

  if (catalog_code === "SC-CONSULTA-GENERAL") {
    serviceDescription = "Una consulta general ayudará a evaluar a tu mascota y recibir recomendaciones profesionales de salud.";
    serviceStatus = "Chequeo necesario";
    serviceCategory = "Consulta General";
  } else if (vaccine_id || serviceName.toLowerCase().includes("vacuna") || serviceName.toLowerCase().includes("vax") || serviceName.toLowerCase().includes("pentavalente") || serviceName.toLowerCase().includes("triple") || serviceName.toLowerCase().includes("rabia") || serviceName.toLowerCase().includes("bordetella")) {
    serviceDescription = "Mantener el esquema de vacunación al día es vital para prevenir enfermedades infecciosas graves.";
    serviceStatus = "Esquema pendiente";
    serviceCategory = "Vacunación";
  } else if (serviceName.toLowerCase().includes("desparasit") || serviceName.toLowerCase().includes("deworm")) {
    serviceDescription = "La desparasitación periódica protege a tu compañero y a tu familia de parásitos internos y externos.";
    serviceStatus = "Dosis pendiente";
    serviceCategory = "Desparasitación";
  }

  return (
    <View flex bg-white>
      {!hasParams && (
        <View paddingH-20 paddingT-20 paddingB-10>
          <View row spread centerV>
            <View>
              <Text text50BO color={Colors.primaryColor}>¡Guau!</Text>
              <Text text60 color={Colors.primaryColor} style={{ fontWeight: '400' }}>Me encanta verte por aquí.</Text>
            </View>
            <MaterialCommunityIcons name="bell-outline" size={24} color={Colors.black} />
          </View>

          <View marginT-20 style={{ backgroundColor: '#F2F2F2', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="magnify" size={20} color={Colors.gray} style={{ marginRight: 10 }} />
            <TextField
              placeholder="Explora, reserva y cuida de tu compañero."
              value={searchInput}
              onChangeText={setSearchInput}
              onSubmitEditing={handleSearch}
              hideUnderline
              style={{ flex: 1, fontSize: 14 }}
            />
          </View>

          <View marginT-15 row style={{ flexWrap: 'wrap' }}>
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={{ backgroundColor: '#F2F7FA', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 15, marginRight: 8, marginBottom: 10 }}
                onPress={() => handlePillClick(cat.name)}
              >
                <Text text90 color="#1A2D3A">{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {isFromNotification && !!serviceName && (
        <View paddingH-20 marginT-15>
          <Text text65BO color={Colors.black} marginB-8>
            Servicio seleccionado
          </Text>
          <View
            style={{
              backgroundColor: Colors.white,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#EAEAEA",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View row spread centerV marginB-8>
              <Text text70BO color={Colors.primaryColor}>
                {serviceName}
              </Text>
              <View
                row
                centerV
                style={{
                  backgroundColor: "#FFF5F5",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: Colors.red || "#D32F2F",
                    marginRight: 6,
                  }}
                />
                <Text text90BO style={{ color: Colors.red || "#D32F2F", fontSize: 11 }}>
                  {serviceStatus}
                </Text>
              </View>
            </View>

            <Text text85 color={Colors.gray} marginB-12 style={{ lineHeight: 18 }}>
              {serviceDescription}
            </Text>

            <View style={{ height: 1, backgroundColor: "#EAEAEA" }} marginB-12 />

            <View row centerV>
              <MaterialCommunityIcons
                name="bookmark-outline"
                size={16}
                color={Colors.primaryColor}
                style={{ marginRight: 6 }}
              />
              <Text text90M color={Colors.black}>
                {serviceCategory}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View paddingB-10 paddingL-20 style={{ borderTopWidth: !hasParams ? 1 : 0, borderTopColor: '#EAEAEA', paddingTop: !hasParams ? 15 : 0 }}>
        <Text text60BO color={Colors.black} marginT-10>
          {isFromNotification
            ? "Opciones disponibles cerca de ti"
            : (hasParams ? "Encontramos estas opciones para ti" : "Cerca de ti")}
        </Text>
      </View>

      <FlatList
        data={listPartners}
        renderItem={({ item }) => (
          <RenderPartners item={item} goToMoreInfo={goToMoreInfo} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ flex: 1 }}
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
