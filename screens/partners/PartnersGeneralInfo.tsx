import { ScrollView, Share, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../styles/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import ApiFetcher from "../../modules/ApiFetcher";
import { Text, View, Image, TouchableOpacity } from "react-native-ui-lib";
import { clearAppointments } from "../../redux/slice/appointmentSlice";
import { useDispatch } from "react-redux";
import { OpenDirectionMap } from "../../components/appointments/OpenDirection";
import { UserItem } from "../../components/renders/UserItem";
import { ServicesOptionsList } from "../../components/appointments/ServicesOptionsList";
import PartnersContactInformation from "./PartnersContactInformation";
import Toast from "react-native-toast-message";
import Loading from "../../components/Loading";

const PartnersGeneralInfo = () => {
  const { params } = useRoute<any>()
  const {id,type} = params
  const navigation = useNavigation<any>();

  const apiFetcher = new ApiFetcher();

  const dispatch = useDispatch();

  const [item, setItem] = useState<PartnerGeneralInfo>({
    services: [],
    users: [],
    partner: {
      picture: null,
      latitude: "0",
      longitude: "0",
      name: "",
      id: "",
      partnerId:"",
      description:"",
      phone:"",
      type_partner: {
        id: 0,
        name: ""
      }
    },
    address: {
      state: "",
      city: "",
      street: ""
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);

  const services = item.services
  const users = item.users
  const partner = item.partner

  const partnerLocation = `${item?.address?.state}, ${item?.address?.city} ${item?.address?.street}`;

  useEffect(() => {
    dispatch(clearAppointments());
    getPartnerInfo();
  }, []);

  const getPartnerInfo = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const partner = await apiFetcher.getPartnersById(id);
      console.log(JSON.stringify(partner.data, null, " "));
      if (partner.code == 200 || partner.code == 201) setItem(partner.data);
    } catch (error) {
      console.log("Error: ", error);
      Toast.show({
        type: "error",
        text1: "Ha ocurrido un error",
        text2: "Inténtelo de nuevo más tarde",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareInfo = async (url: string): Promise<void> => {
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
      Toast.show({
        type: "error",
        text1: "Ha ocurrido un error",
        text2: "Inténtelo de nuevo más tarde",
      });
    }
  };

  const handleDirections = (): void => {
    setShowActionSheet(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {isLoading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      <ScrollView style={{ padding: 10 }}>
        <View row spread>
          {!isLoading && (
            <Image
              source={{ uri: partner.picture }}
              height={90}
              width={90}
              style={{ borderRadius: 11 }}
              resizeMode="cover"
            />
          )}
          <TouchableOpacity onPress={() => shareInfo(partner.latitude)}>
            <Image
              source={require("../../assets/share.png")}
              width={25}
              height={25}
              marginR-15
            />
          </TouchableOpacity>
        </View>
        <View
          marginT-15
          paddingB-40
          style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.5 }}
        >
          <Text text40H>{partner.name}</Text>
          <Text text70 marginT-5 color={Colors.gray}>
            {partnerLocation}
          </Text>
        </View>
        <View
          marginT-15
          paddingB-50
          style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.5 }}
        >
          <Text text60BO>Servicios</Text>
          <ServicesOptionsList
            services={services}
            partnerLocation={partnerLocation}
            users={users}
            partnerId={partner.id}
          />
        </View>
        <View
          marginT-15
          paddingB-20
          style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.5 }}
        >
          <Text text60BO>{type == 2 ? "Especialistas" : "Estilistas"}</Text>
          <View
            style={
              users.length != 0
                ? {
                  margin: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }
                : {}
            }
          >
            <FlatList
              data={users}
              horizontal={true}
              renderItem={({ item }) => (
                <UserItem
                  onPress={() =>
                    navigation.navigate("ListPartners", {
                      partnerId: partner.id,
                      partners: users,
                      services: services,
                      partnerLocation: partnerLocation,
                    })
                  }
                  picture={{ uri: item.picture }}
                  name={item.display_name}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={() => (
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
        <PartnersContactInformation
          partner={partner}
          handleDirections={handleDirections}
        />
        <OpenDirectionMap
          latitude={item?.partner?.latitude}
          longitude={item?.partner?.longitude}
          setShowActionSheet={setShowActionSheet}
          showActionSheet={showActionSheet}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PartnersGeneralInfo;
