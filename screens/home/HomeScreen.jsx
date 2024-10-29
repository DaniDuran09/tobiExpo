import React, { useCallback } from "react";
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
import AppStorage from "../../modules/AppStorage";
import ApiFetcher from "../../modules/ApiFetcher";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import NoPetsHome from "../../components/NoPetsHome";
import { setUserInfo } from "../../redux/slice/userSlice";
import { AnimatedImage, LoaderScreen, Text } from "react-native-ui-lib";
import Toast from "react-native-toast-message";
import momentTZ from "../../utils/moment";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.userInfo);

  const dispatch = useDispatch();

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [userData, setUserData] = React.useState({});

  const apiFetcher = new ApiFetcher();
  const appStorage = new AppStorage();

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
          return { ...pet, service_date: response };
        })
      );
      setData(petsWithAppointments);
    } catch (e) {
      console.log("Error: ", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchInfoAppointmentPet = async (id) => {
    try {
      const response = await apiFetcher.getAppointmentsByPet(id);
      if (response.data.length > 0) return response.data[0].date_service;
      else return "";
    } catch (error) {
      console.log("Error: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `No hemos podido obtener la información`,
      });
      // navigation.goBack();
    }
  };

  const renderItem = (item) => {
    // console.log(item?.service_date);
    let service = "---";
    let remainingDays = {
      text: "---",
      color: "black",
    };

    if (item?.service_date) {
      const serviceDate = momentTZ(item?.service_date);
      const today = momentTZ();

      console.log("today: ", today);

      // console.log(
      //   "serviceDate: ",
      //   serviceDate.format("dddd D [de] MMMM, h:mm [hrs]")
      // );

      service = momentTZ(item?.service_date).format("DD[.]MMM");
      const daysDifference = serviceDate.diff(today, "days");
      if (daysDifference < 0) {
        remainingDays = {
          text: "---",
          color: "black",
        };
        servicce="---"
      } else if (daysDifference === 0) {
        remainingDays = {
          text: "La cita es hoy",
          color: "green",
        };
      } else {
        remainingDays = {
          text: `${daysDifference} días`,
          color: "green",
        };
      }
    } //else {
    //   service = "Sin citas";
    // }
    
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
            style={{ height: 35,
              width: 35,
              borderRadius: 32, }}
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
                >{`${item?.weight_status?.ideal_weight?.from /1000} Kg - ${
                  item?.weight_status?.ideal_weight?.to / 1000
                } Kg`}</Text>
                <Text ttext90M>Real</Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "red",
                    fontWeight: "bold",
                  }}
                >{`${item.weight} Kg`}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {item.activity_level.stable ? null : (
                      <Image
                        source={require("../../assets/Polygon3.png")}
                        style={{ height: 15, width: 15 ,transform: [{ rotate: item.weight_status.weight > item.weight_status.ideal_weight?.from/1000  ? '0deg' : '180deg' }]}}
                        resizeMode={"contain"}
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
          <TouchableWithoutFeedback
          /* onPress={() =>
              navigation.navigate("HomeProfileDetails", { item, tabIndex: 0 })
            }*/
          >
            <View elevation={5} style={styles.elevation}>
              <Text style={{ fontSize: 14, color: "grey", fontWeight: "bold" }}>
                NUTRICIÓN
              </Text>
              {/*
              <Text ttext90M>
                Ingesta diaria recomendada
              </Text>
              <Text
                text80BL
              >
                ---
              </Text>
              <Text ttext90M>
                Entre --- raciones al día
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.activity_level.stable ? null : <></>}
                  {/* <Text
                    style={{ fontSize: 14, color: "black", fontWeight: "300" }}
                  >{`${item.activity_level_status.percent}%`}</Text> 
                  <></>
                </View>
                <Text
                  style={{ fontSize: 14, color: "black", fontWeight: "300" }}
                >
                  + info
                </Text>
              </View>*/}
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
          <TouchableWithoutFeedback
          /*onPress={() =>
              navigation.navigate("HomeProfileDetails", { item, tabIndex: 3 })
            }*/
          >
            <View elevation={5} style={styles.elevation}>
              <Text style={{ fontSize: 14, color: "grey", fontWeight: "bold" }}>
                ACTIVIDAD
              </Text>
              {/*
              <Text ttext90M>
                Recomendación
              </Text>
              <Text
                text80BL
              >{`${item.activity_level_status.steps} pasos`}</Text>
              <Text ttext90M>
                ---
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: item.activity_level.stable ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {item.activity_level.steps}
              </Text>
               
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.activity_level.stable ? null : (
                    <Image
                      source={require("../../assets/Polygon.png")}
                      style={{ height: 15, width: 15, marginRight: 5 }}
                      resizeMode={"contain"}
                    />
                  )}
                  <Text
                    style={{ fontSize: 14, color: "black", fontWeight: "300" }}
                  >{`${item.activity_level_status.percent}%`}</Text>
                </View>
                <Text
                  style={{ fontSize: 14, color: "black", fontWeight: "300" }}
                >
                  + info
                </Text>
              </View>*/}
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
