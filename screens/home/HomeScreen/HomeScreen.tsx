import React, { useCallback, useEffect, useState } from "react";
import { BackHandler, FlatList, Platform, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "react-native-paper";
import { Colors } from "../../../styles/Colors";
import ApiFetcher from "../../../modules/ApiFetcher";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import momentTZ from "../../../utils/moment";
import { setUserInfo } from "../../../redux/slice/userSlice";
import RenderSections from "../../../components/renders/RenderSections";
import NoPetsHome from "../../../components/NoPetsHome";
import { NotificationPermissionDialog } from "../../../components/notifications";
import { View, Text, TouchableOpacity } from "react-native-ui-lib";
import useNotificationsPermissions from "../../../hooks/useNotificationsPermission";
import { useNotificationsContext } from "../../../context/NotificationContext";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionCard from "../../../components/home/ActionCard";
import Banner from "../../../components/home/Banner";

const HomeScreen = ({ navigation }: any) => {
  const user = useSelector((state: any) => state.user.userInfo);
  const dispatch = useDispatch();

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>({});
  const [homeFeed, setHomeFeed] = useState<any>({ banner: null, cards: [] });

  const apiFetcher = new ApiFetcher();

  const { notificationPermissionResponse } = useNotificationsPermissions();
  const { registerForPushNotifications } = useNotificationsContext();


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (notificationPermissionResponse?.granted) {
      registerForPushNotifications();
    }
  }, [notificationPermissionResponse]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      return () => {};
    }, [navigation])
  );

  const fetchData = async () => {
    try {
      const list = await apiFetcher.getPets();
      if (list) setData(list.data);
      console.log("data list ",list.data);
      const user = await apiFetcher.getProfile();
      setUserData(user.data);
      dispatch(setUserInfo(user.data));
      
      try {
        const feedResponse = await apiFetcher.getHomeFeed();
        if (feedResponse && feedResponse.data) {
          setHomeFeed(feedResponse.data);
        }
      } catch (feedError) {
        console.log("Error fetching home feed: ", feedError);
      }

      const petsWithAppointments = await Promise.all(
        list.data.map(async (pet: any) => {
          const response = await fetchInfoAppointmentPet(pet.id);
          const hasUpcomingAppointment = !!response?.appointment_status;
          return {
            ...pet,
            service_date: response?.appointment_pet_services
              ? response?.appointment_pet_services[0]?.appointment_time
                  ?.start_time
              : null,
            status: response.appointment_status,
            has_appointment: hasUpcomingAppointment,
          };
        })
      );
      setData(petsWithAppointments);
    } catch (error) {
      console.log("Error: ", error);
      Toast.show({
        type: "error",
        text1: "Ocurrió un error",
        text2: `Inténtalo de nuevo más tarde`,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInfoAppointmentPet = async (id: string) => {
    const response = await apiFetcher.getAppointmentsByPet(id);

    if (response.data.length === 0) return {};

    const today = momentTZ().tz("America/Mexico_City").startOf("day");

    const futureAppointments = response.data.filter((appointment: any) => {
      const appointmentDate = momentTZ(appointment.date_service)
        .tz("America/Mexico_City")
        .startOf("day");
      return appointmentDate.isSameOrAfter(today);
    });

    if (futureAppointments.length === 0) return {};

    const closestAppointment = futureAppointments.reduce(
      (closest: any, current: any) => {
        const currentDate = momentTZ(current.date_service).tz(
          "America/Mexico_City"
        );
        const closestDate = momentTZ(closest.date_service).tz(
          "America/Mexico_City"
        );

        const currentDiff = Math.abs(currentDate.diff(today, "days"));
        const closestDiff = Math.abs(closestDate.diff(today, "days"));

        return currentDiff < closestDiff ? current : closest;
      }
    );

    return closestAppointment;
  };

  useEffect(() => {
    const backAction = () => {
      if (Platform.OS === "android") {
        BackHandler.exitApp();
        return true;
      }
      return false;
    };

    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }
    return () => {
      if (Platform.OS === "android") {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
      }
    };
  }, []);

  const handleAction = async (action: string, data: any, fingerprint?: string) => {
    console.log("Action pressed:", action, data, fingerprint);
    
    if (fingerprint) {
      await apiFetcher.markHomeCardAsRead(fingerprint);
    }

    const serviceName = data?.service_catalog?.name || data?.service_name || data?.vaccine_name || data?.vaccine?.name || data?.deworming_name || data?.name || null;

    switch (action) {
      case "view_appointment":
        navigation.navigate("AppointmentsHome");
        break;
      case "view_vaccines":
      case "view_deworming":
        navigation.navigate("Explore", {
          screen: "SelectService",
          params: {
            q: serviceName,
            petId: data?.pet_id ?? null,
            serviceId: null,
            vaccine_id: data?.vaccine_id ?? null,
            catalog_code: null,
            service_catalog_id: data?.service_catalog_id ?? null,
          },
        });
        break;
      case "book_consultation":
      case "book_appointment":
        navigation.navigate("Explore", {
          screen: "SelectService",
          params: {
            q: serviceName,
            petId: data?.pet_id ?? null,
            serviceId: null,
            vaccine_id: data?.vaccine_id ?? null,
            catalog_code: null,
            service_catalog_id: data?.service_catalog_id ?? null,
          },
        });
        break;
      case "view_summary":
        if (data?.visit_id) {
          apiFetcher.markVisitSummaryOpened(data.visit_id).catch(e => console.warn(e));
          navigation.navigate("VisitDetails", { id: data.visit_id });
        } else {
          navigation.navigate("AppointmentsHome");
        }
        break;
      case "view_recommendation":
        navigation.navigate("HomeProfileDetails", { petId: data?.pet_id });
        break;
      case "edit_profile":
        navigation.navigate("ProfileStack", { screen: "ProfileEditUser" });
        break;
      case "add_pet":
        navigation.navigate("RegisterNewPet", { returnTo: "HomeScreen" });
        break;
      default:
        console.warn("[HomeScreen] Sin navegación para action:", action);
    }
  };

  const renderHomeFeed = () => {
    let bannersToShow = [];
    let cardsToShow = [];

    if (homeFeed.banner) {
      bannersToShow.push(homeFeed.banner);
    }

    if (homeFeed.cards && homeFeed.cards.length > 0) {
      cardsToShow = homeFeed.cards.slice(0, 2);
    }

    if (bannersToShow.length === 0 && cardsToShow.length === 0) return null;

    return (
      <View>
        {bannersToShow.map((banner, idx) => (
          <Banner key={`banner-${idx}`} banner={banner} onPress={handleAction} />
        ))}
        {cardsToShow.length > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginTop: 8 }}>
            <Text text70BL color={Colors.primaryColor}>Cuidados pendientes</Text>
            <TouchableOpacity onPress={() => navigation.navigate("PendingCare")}>
              <Text text80 color={Colors.primaryColor}>Ver todos</Text>
            </TouchableOpacity>
          </View>
        )}
        {cardsToShow.map((card, idx) => (
          <ActionCard key={`card-${idx}`} card={card} onPress={handleAction} />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <NotificationPermissionDialog />
      <View row gap-15 paddingH-15 centerV>
        <Avatar.Image
          source={{
            uri: userData.picture,
          }}
          size={60}
        />
        <View>
          <Text
            text50BL
            color={Colors.primaryColor}
          >{`Hola ${user.name}`}</Text>
          <Text text50L color={Colors.primaryColor}>
            Buenos días
          </Text>
        </View>
      </View>
      <View center marginT-30 marginB-30>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `item-${index}`}
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => fetchData()}
              tintColor={Colors.primaryColor}
              title="Loading..."
              titleColor={Colors.primaryColor}
            />
          }
          renderItem={({ item }) => <RenderSections item={item} />}
          contentContainerStyle={{ flexGrow: 1 }}
          ListHeaderComponent={renderHomeFeed}
          ListEmptyComponent={<NoPetsHome onPress={() => navigation.navigate("RegisterNewPet", { returnTo: "HomeScreen" })} />}
          ListFooterComponent={
            <View marginB-30>
              <TouchableOpacity
                onPress={() => navigation.navigate("RegisterNewPet", { returnTo: "HomeScreen" })}
                marginB-20
              >
                <Text text70L>
                  + Mascota
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
