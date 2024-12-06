import {
  ScrollView,
  Share,
  Alert,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../styles/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import ApiFetcher from "../../modules/ApiFetcher";
import { Text, View, Image } from "react-native-ui-lib";
import { clearAppointments } from "../../redux/slice/appointmentSlice";
import { useDispatch } from "react-redux";
import { UserItem } from "../../components/UserItem";
import { ServicesOptionsList } from "../../components/ServicesOptionsList";
import PartnersContactInformation from "./PartnersContactInformation";
import Toast from 'react-native-toast-message';


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
      Toast.show(
        {
          type: 'error',
          text1: 'Ha ocurrido un error',
          text2: "Inténtelo de nuevo más tarde",
        }
      )      
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
      <SafeAreaView style={{flex: 1,backgroundColor: Colors.white}}/>
    )
  }


  return (
    <SafeAreaView style={{flex: 1,backgroundColor: Colors.white,}}>
      <ScrollView style={{padding:10}}>
        <View row spread>
            <Image
              source={{ uri: partner.picture }}
              height={90}
              width={90}
              style={{borderRadius: 11}}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => shareInfo(partner.latitude)}
            >
            <Image
              source={require("../../assets/share.png")}
              width={25}
              height={25}
              marginR-15              
            />
            </TouchableOpacity>
        </View>
        <View marginT-15 paddingB-40 style={{borderBottomColor: Colors.gray,borderBottomWidth: 0.5}}>
          <Text text40H>{partner.name}</Text>
          <Text text70 marginT-5 color={Colors.gray}>{partnerLocation}</Text>
        </View>
        <View marginT-15 paddingB-20 style={{borderBottomColor: Colors.gray,borderBottomWidth: 0.5}}>
          <Text text60BO>Servicios</Text>             
          <ServicesOptionsList 
            services={services} 
            partnerLocation={partnerLocation} 
            users={users} 
            partnerId={partner.partnerId}
          />
        </View>
        <View marginT-15 paddingB-20 style={{borderBottomColor: Colors.gray,borderBottomWidth: 0.5}}>
          <Text text60BO>
            {type == 2 ? "Especialistas" : "Estilistas"}
          </Text>
          <View
            style={users.length != 0 ? {margin: 20,flexDirection: "row",justifyContent: "space-between"} : {}}
          >
            <FlatList
                data={users}
                horizontal={true}
                renderItem={({ item }) => renderUsers(item)}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={()=>(
                  <View marginT-10 center>
                  <Text text70 marginT-5 color={Colors.gray}>
                    No hay {type == 2 ? "especialistas" : "estilistas"}{" "}
                    disponibles
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