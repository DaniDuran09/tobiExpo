import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "react-native-paper";
import { Colors } from "../../styles/Colors";
import ApiFetcher from "../../modules/ApiFetcher";
import { useFocusEffect } from "@react-navigation/native";
import NoPetsHome from "../../components/NoPetsHome";
import { setUserInfo } from "../../redux/slice/userSlice";
import { LoaderScreen, Text, View } from "react-native-ui-lib";
import Toast from "react-native-toast-message";
import momentTZ from "../../utils/moment";
import RenderSections from "../../components/renders/RenderSections";

const HomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.userInfo);

  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  const apiFetcher = new ApiFetcher();

  useEffect(() => {
    fetchData();
  }, []);

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
      const user = await apiFetcher.getProfile();
      setUserData(user.data);
      dispatch(setUserInfo(user.data));
      const petsWithAppointments = await Promise.all(
        list.data.map(async (pet) => {
          const response = await fetchInfoAppointmentPet(pet.id);
          return {
            ...pet,
            service_date: response?.appointment_pet_services
              ? response?.appointment_pet_services[0]?.appointment_time
                  ?.start_time
              : null,
            status: response.appointment_status,
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

  const fetchInfoAppointmentPet = async (id) => {
    const response = await apiFetcher.getAppointmentsByPet(id);

    if (response.data.length === 0) return {};

    const today = momentTZ().tz("America/Mexico_City");

    const closestAppointment = response.data.reduce((closest, current) => {
      const currentDate = momentTZ(current.date_service).tz(
        "America/Mexico_City"
      );
      const closestDate = momentTZ(closest.date_service).tz(
        "America/Mexico_City"
      );

      const currentDiff = Math.abs(currentDate.diff(today, "days"));
      const closestDiff = Math.abs(closestDate.diff(today, "days"));

      return currentDiff < closestDiff ? current : closest;
    });

    return closestAppointment;
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <View row gap-15 paddingH-15 marginT-30>
        <Avatar.Image
          source={{
            uri: userData.picture,
          }}
          size={60}
          loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
          animationDuration={500}
        />
        <View>
          <Text text50 color={Colors.primaryColor}>{`Hola ${user.name}`}</Text>
          <Text text50 color={Colors.primaryColor}>
            Buenos días
          </Text>
        </View>
      </View>
      <View center marginT-30 marginB-90>
        
          {data.length > 0 ? (
            <FlatList
              keyExtractor={(item, index) => `item-${index}`}
              data={data}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={() => fetchData()}
                  tintColor={Colors.primaryColor}
                  title="Loading..."
                  titleColor="black"
                  colors={["black", "black", "black"]}
                  progressBackgroundColor="white"
                />
              }
              renderItem={({ item }) => <RenderSections item={item} />}
            />
          ) : (
            <NoPetsHome />
          )}
        </View>
      
    </SafeAreaView>
  );
};

export default HomeScreen;
