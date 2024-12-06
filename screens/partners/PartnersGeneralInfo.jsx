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
import ApiFetcher from "../../modules/ApiFetcher";
import MapViewComponent from "./MapViewComponent";
import { Text, View } from "react-native-ui-lib";
import { clearAppointments } from "../../redux/slice/appointmentSlice";
import { useDispatch } from "react-redux";
import { UserItem } from "../../components/UserItem";
import { ServicesOptionsList } from "../../components/ServicesOptionsList";
import PartnersContactInformation from "./PartnersContactInformation";

const PartnersGeneralInfo = ({ route }) => {
  const { id, type } = route.params;

  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation();
  const dispatch = useDispatch()

  const [item, setItem] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const services = item.services??[]
  const users = item.users??[]
  const partner = item.partner
  const partnerLocation = `${item?.address?.state}, ${item?.address?.city} ${item?.address?.street}`;

  useEffect(() => {
    dispatch(clearAppointments())
    getPartnerInfo();
  }, []);

  const getPartnerInfo = async () => {
    try {
      const partner = await apiFetcher.getPartnersById(id);
      console.log(JSON.stringify(partner.data,null," "))
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

  const renderUsers= (user) => {
    return (
      <UserItem
        onPress={() =>
          navigation.navigate("ListPartners", {
            partnerId: partner.id,
            partners: users,
            services: services,
            partnerLocation: partnerLocation
          })
        }
        picture={{uri:user.picture}}       
        name={user.display_name}
      />
    );
  };

  if(isLoading){
    return (
      <SafeAreaView style={styles.container}/>
    )
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.containerAll}>
        <View style={styles.headerContainer}>
            <Image
              source={{ uri: partner.picture }}
              style={styles.imageItem}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => shareInfo(partner.latitude)}
            >
            <Image
              source={require("../../assets/share.png")}
              style={{ height: 25, width: 25, marginRight: 15 }}
            />
            </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.mainTitle}>{partner.name}</Text>
          <Text style={styles.itemDirection}>{partnerLocation}</Text>
        </View>
        <View style={styles.servicesContainer}>
          <Text style={styles.itemTitle}>Servicios</Text>             
          <ServicesOptionsList 
            services={services} 
            partnerLocation={partnerLocation} 
            users={users} 
            partnerId={partner.partnerId}
          />
        </View>
        <View style={styles.servicesContainer}>
          <Text style={styles.itemTitle}>
            {type == 2 ? "Especialistas" : "Estilistas"}
          </Text>
          <View
            style={users.length != 0 ? styles.personsContainer : {}}
          >
            <FlatList
                data={users}
                horizontal={true}
                renderItem={({ item }) => renderUsers(item)}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={()=>(
                  <View style={styles.notServices}>
                  <Text style={styles.itemDirection}>
                    No hay {type == 2 ? "especialistas" : "estilistas"}{" "}
                    disponibles uwu
                  </Text>
                </View>
                )}
              />
          </View>
        </View>
        <PartnersContactInformation partner={partner}/>
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
