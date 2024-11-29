import React, { useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "react-native-paper";
import { Colors, gradientColors } from "../../styles/Colors";
import ApiFetcher from "../../modules/ApiFetcher";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import NoPetsHome from "../../components/NoPetsHome";
import { setUserInfo } from "../../redux/slice/userSlice";
import { AnimatedImage, LoaderScreen, Text } from "react-native-ui-lib";
import Toast from "react-native-toast-message";
import momentTZ from "../../utils/moment";
import { calculateIdealWeight } from "../../utils/scripts";
import Icon from "react-native-vector-icons/Entypo";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.userInfo);

  const dispatch = useDispatch();

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [userData, setUserData] = React.useState({});

  const apiFetcher = new ApiFetcher();

  React.useEffect(() => {
    fetchDta();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDta();
      return () => {};
    }, [navigation])
  );

  const fetchDta = async () => {
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
            service_date: response.date_service,
            status: response.appointment_status,
          };
        })
      );
      setData(petsWithAppointments);
    } catch (e) {
      console.log("Error: ", e);
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
    try {
      const response = await apiFetcher.getAppointmentsByPet(id);

      console.log("response: ", response.data[0])
      return response.data.length > 0 ? response.data[0] : {};
    } catch (error) {
      console.log("Error: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `No hemos podido obtener la información`,
      });
    }
  };

  const renderItem = (item) => {
    const rangeOne = item?.weight_status?.ideal_weight?.from / 1000;
    const rangeTwo = item?.weight_status?.ideal_weight?.to / 1000;
    const realWeight = calculateIdealWeight(
      rangeOne,
      rangeTwo,
      item?.weight_status.weight
    );
    let service = "---";
    let remainingDays = {
      text: "---",
      color: "black",
    };

    if (item.status === "actived" && item?.service_date) {
      const serviceDate = momentTZ(item?.service_date).tz(
        "America/Mexico_City"
      );
      const today = momentTZ().tz("America/Mexico_City");

      const daysDifference = Math.ceil(serviceDate.diff(today, "hours") / 24);
      if (daysDifference < 0) {
        remainingDays = {
          text: "---",
          color: "black",
        };
      } else if (daysDifference === 0) {
        service = momentTZ(item?.service_date).utc().format("DD.MMM");

        remainingDays = {
          text: "La cita es hoy",
          color: "green",
        };
      } else if (daysDifference > 0) {
        service = momentTZ(item?.service_date).utc().format("DD.MMM");
        remainingDays = {
          text: `${daysDifference} días`,
          color: "green",
        };
      }
    }

    return (
      <View>
        <View
          style={{
            height: 70,
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <AnimatedImage
            source={{ uri: item?.picture }}
            style={{ height: 35, width: 35, borderRadius: 32 }}
            loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
            animationDuration={500}
          />
          <Text text70BO marginL-10>
            {item.name}
          </Text>
        </View>
        <View
          style={{
            height: 180,
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <LinearGradient colors={gradientColors} style={styles.gradient}>
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate("HomeProfileDetails", { item, tabIndex: 0 })
              }
            >
              <View
                elevation={5}
                style={[
                  styles.elevation,
                  {
                    height: "98%",
                    width: "98%",
                    justifyContent: "space-around",
                    paddingHorizontal: 10,
                  },
                ]}
              >
                <Text text80BL>SALUD</Text>
                <Text ttext90M>Próxima visita</Text>
                <Text text80BL>{service}</Text>
                <Text ttext90MM>Faltan</Text>
                <Text color={remainingDays.color} text80BO>
                  {remainingDays.text}
                </Text>
                <Text>+ info</Text>
              </View>
            </TouchableWithoutFeedback>
          </LinearGradient>
          <LinearGradient colors={gradientColors} style={styles.gradient}>
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate("HomeProfileDetails", { item, tabIndex: 1 })
              }
            >
              <View
                elevation={5}
                style={[
                  styles.elevation,
                  {
                    height: "98%",
                    width: "98%",
                    justifyContent: "space-around",
                    paddingHorizontal: 10,
                  },
                ]}
              >
                <Text text80BL>BIENESTAR</Text>
                <Text ttext90M>Recomendación</Text>
                <Text text80BL>---</Text>
                <Text
                  style={{ fontSize: 14, color: "black", fontWeight: "300" }}
                >
                  + info
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </LinearGradient>
        </View>
        <View
          style={{
            height: 180,
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <LinearGradient colors={gradientColors} style={styles.gradient}>
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate("HomeProfileDetails", { item, tabIndex: 2 })
              }
            >
              <View
                elevation={5}
                style={[
                  styles.elevation,
                  {
                    height: "98%",
                    width: "98%",
                    justifyContent: "space-around",
                    paddingHorizontal: 10,
                  },
                ]}
              >
                <Text text80BL>PESO</Text>
                <Text ttext90M>Rango ideal</Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "black",
                    fontWeight: "bold",
                  }}
                >{`${item?.weight_status?.ideal_weight?.from / 1000} Kg - ${
                  item?.weight_status?.ideal_weight?.to / 1000
                } Kg`}</Text>
                <Text ttext90M>Real</Text>
                <Text
                  style={[
                    {
                      fontSize: 14,
                      color: "red",
                      fontWeight: "bold",
                    },
                    realWeight.ideal && { color: Colors.green },
                  ]}
                >{`${item.weight} Kg`}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {!realWeight.ideal && (
                      <Icon
                        name={realWeight.down ? "triangle-down" : "triangle-up"}
                        color="red"
                        size={25}
                      />
                    )}
                    <Text
                      style={{
                        fontSize: 14,
                        color: "black",
                        fontWeight: "300",
                      }}
                    >{`---------%`}</Text>
                  </View>
                  <Text
                    style={{ fontSize: 14, color: "black", fontWeight: "300" }}
                  >
                    + info
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </LinearGradient>
          <TouchableWithoutFeedback>
            <View elevation={5} style={styles.elevation}>
              <Text style={{ fontSize: 14, color: "grey", fontWeight: "bold" }}>
                NUTRICIÓN
              </Text>
              <Text>PROXIMAMENTE...</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            height: 180,
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TouchableWithoutFeedback>
            <View elevation={5} style={styles.elevation}>
              <Text style={{ fontSize: 14, color: "grey", fontWeight: "bold" }}>
                ACTIVIDAD
              </Text>
              <Text>PROXIMAMENTE...</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() =>
              navigation.navigate("HomeProfileDetails", { item, tabIndex: 2 })
            }
          >
            <View style={{ width: "45%" }}></View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white }}>
      <View style={styles.container}>
        <View
          style={{
            width: width / 1.05,
            height: "15%",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Avatar.Image
            source={{
              uri: userData.picture,
            }}
            size={60}
          />
          <View style={{ paddingLeft: 15 }}>
            <Text
              text50
              color={Colors.primaryColor}
            >{`Hola ${user.name}`}</Text>
            <Text text50 color={Colors.primaryColor}>
              Buenos días
            </Text>
          </View>
        </View>
        <View style={{ width: width / 1.1, height: "85%" }}>
          {data.length > 0 ? (
            <FlatList
              keyExtractor={(item, index) => `item-${index}`}
              data={data}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={() => fetchDta()}
                  tintColor={Colors.primaryColor}
                  title="Loading..."
                  titleColor="black"
                  colors={["black", "black", "black"]}
                  progressBackgroundColor="white"
                />
              }
              renderItem={({ item }) => renderItem(item)}
            />
          ) : (
            <View style={styles.noPetsContainer}>
              <NoPetsHome />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  gradient: {
    height: "95%",
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    border: 10,
  },
  container: {
    alignItems: "center",
    backgroundColor: Colors.white,
    justifyContent: "center",
  },
  text: {
    fontSize: 11,
  },
  elevation: {
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    height: "90%",
    width: "45%",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    backgroundColor: Colors.lightGray,
  },
  noPetsContainer: {
    height: "95%",
    justifyContent: "center",
  },
  newPetButton: {
    alignSelf: "center",
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.black,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    padding: "4%",
  },
  newPetText: {
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: { position: "absolute", bottom: 10, width: "100%" },
});
