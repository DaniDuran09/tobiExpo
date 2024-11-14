import {
  Image,
  ScrollView,
  StyleSheet,
  Share,
  Alert,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../styles/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceOption from "../../components/ServiceOption";

import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import AppStorage from "../../modules/AppStorage";
import { getPartensId } from "../../services";
// import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import ApiFetcher from "../../modules/ApiFetcher";
import MapViewComponent from "./MapViewComponent";
import { ActionSheet, Text, View } from "react-native-ui-lib";
import { clearAppointments } from "../../redux/slice/appointmentSlice";
import { useDispatch } from "react-redux";

const PartnersGeneralInfo = ({ route }) => {
  const { id, type } = route.params;

  const appStorage = new AppStorage();
  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation();
  const dispatch = useDispatch()

  const partner = [{}, {}, {}, {}];

  const [item, setItem] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  console.log(item.users)

  useEffect(() => {
    dispatch(clearAppointments())
    getPartnerInfo();
  }, []);

  const getPartnerInfo = async () => {
    try {
      const partner = await apiFetcher.getPartnersById(id);
      // console.log("Si entro y regreso lo siguiente: ", partner.data)
      if (partner.code == 200 || partner.code == 201) setItem(partner.data);
      setIsLoading(false);
    } catch (error) {
      console.log("Error: ", error);
      Alert.alert("Ha ocurrido un error", "Inténtelo de nuevo más tarde");
    }
  };

  const shareInfo = async (url) => {
    try {
      const result = await Share.share({
        message: `Mira este lugar para nuestras mascotas: ${url}`,
        title: "Tobi",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert("Ocurrió un error", "Inténtalo de nuevo más tarde");
    }
  };



  const renderUsers = (user) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ListPartners", {
            partners: item.users,
            services: item.services
          })
        }
      >
        <View center marginR-25>
          <Image
            source={{ uri: user.picture }}
            style={styles.personImage}
            resizeMode="cover"
          />
          <Text text70R>{user.display_name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const partenerLocation = `${item?.address?.state}, ${item?.address?.city} ${item?.address?.street}`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.containerAll}>
        {isLoading ? (
          <></>
        ) : (
          <>
            <View style={styles.headerContainer}>
              <Image
                source={{ uri: item.partner.picture }}
                style={styles.imageItem}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => shareInfo(item.partner.latitude)}
              >
                <Image
                  source={require("../../assets/share.png")}
                  style={{ height: 25, width: 25, marginRight: 15 }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.mainTitle}>{item.partner.name}</Text>
              <Text style={styles.itemDirection}>{partenerLocation}</Text>
            </View>
            <View style={styles.servicesContainer}>
              <Text style={styles.itemTitle}>Servicios</Text>
              {item.services.length == 0 ? (
                <View style={styles.notServices}>
                  <Text style={styles.itemDirection}>
                    No hay servicios disponibles actualmente
                  </Text>
                </View>
              ) : (
                <View style={styles.optionsContainer}>
                  {item.services.map((service, index) => (
                    <ServiceOption
                      key={index}
                      picture={service.picture}
                      service={service}
                      partenerLocation={partenerLocation}
                      listService={item.services}
                      users={item.users}
                    />
                  ))}
                </View>
              )}
            </View>
            <View style={styles.servicesContainer}>
              <Text style={styles.itemTitle}>
                {type == 2 ? "Especialistas" : "Estilistas"}
              </Text>
              <View
                style={item.users.length != 0 ? styles.personsContainer : {}}
              >
                {item?.users?.length == 0 ? (
                  <View style={styles.notServices}>
                    <Text style={styles.itemDirection}>
                      No hay {type == 2 ? "especialistas" : "estilistas"}{" "}
                      disponibles
                    </Text>
                  </View>
                ) : (
                  <>
                    <FlatList
                      data={item.users}
                      horizontal={true}
                      renderItem={({ item }) => renderUsers(item)}
                      keyExtractor={(item) => item.id.toString()}
                      showsHorizontalScrollIndicator={false}
                    />
                  </>
                )}
              </View>
            </View>
            <View style={styles.servicesContainer}>
              <Text style={styles.itemTitle}>Detalles</Text>
              <Text style={styles.itemDirection}>Dirección</Text>
              <View style={styles.mapCompanyContain}>
                <MapViewComponent
                  latitude={item.partner.latitude}
                  longitude={item.partner.longitude}
                  title={item.partner.name}
                  description={item.partner.description}
                />
              </View>
              <Text style={styles.itemDirection}>Información adicional</Text>
              <View style={styles.extraInfo}>
                <View style={styles.flexContain}>
                  <Image
                    source={require("../../assets/parking.png")}
                    style={styles.icon}
                    resizeMode={"cover"}
                  />
                  <View>
                    <Text style={styles.itemTitle}>Estacionamiento</Text>
                    <Text style={styles.itemDirection}>
                      Estacionamiento en vía pública
                    </Text>
                  </View>
                </View>

                <View style={styles.flexContain}>
                  <Image
                    source={require("../../assets/phone-icon.png")}
                    style={styles.icon}
                    resizeMode={"cover"}
                  />
                  <View>
                    <Text style={styles.itemTitle}>Teléfono</Text>
                    <Text style={styles.itemDirection}>
                      {item.partner.phone}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PartnersGeneralInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageItem: {
    height: 90,
    width: 90,
    borderRadius: 11,
  },
  personImage: {
    height: 60,
    width: 60,
    borderRadius: 32,
  },
  containerAll: {
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: "800",
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  itemDirection: {
    fontSize: 15,
    marginTop: 5,
    color: Colors.gray,
  },
  infoContainer: {
    marginTop: 15,
    paddingBottom: 40,
    borderBottomColor: Colors.gray,
    borderBottomWidth: 0.5,
  },
  servicesContainer: {
    marginTop: 15,
    paddingBottom: 20,
    borderBottomColor: Colors.gray,
    borderBottomWidth: 0.5,
  },
  optionsContainer: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  personsContainer: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mapContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    marginTop: 10,
    maxWidth: 400,
    maxHeight: 200,
  },
  mapCompanyContain: {
    alignItems: "center",
    maxHeight: 240,
  },
  extraInfo: {
    marginTop: 20,
  },
  flexContain: {
    flexDirection: "row",
    marginBottom: 15,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  notServices: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
