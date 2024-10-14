import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, gradientColors } from "../../../styles/Colors";
import NoDates from "./NoDates";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ApiFetcher from "../../../modules/ApiFetcher";
import momentTZ from "../../../utils/moment";
import { Text } from "react-native-ui-lib";
import Toast from "react-native-toast-message";
import Loading from "../../../components/Loading";

const PetDate = ({ navigation, route }) => {
  const { pet } = route.params;

  const [appointment, setAppointment] = useState({});
  const [loading, setLoading] = useState(false);
  const [existAppointment, setExistAppointment] = useState(false);

  const apiFetcher = new ApiFetcher();

  useEffect(() => {
    fetchInfoAppointmentPet();
  }, []);

  const fetchInfoAppointmentPet = async () => {
    setLoading(true);
    try {
      const response = await apiFetcher.getAppointmentsByPet(pet.id);
      if (response.data.length > 0) {
        setAppointment(response.data);
        setExistAppointment(true);
      }
    } catch (error) {
      console.log("Error: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `No hemos podido obtener la información`,
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const goToExplore = () => {
    navigation.navigate("Explore");
  };

  const goToResume = (item) => {
    navigation.navigate("ResumeAppointment", { item: item });
  };

  const renderItem = (item) => {
    const dateFormated = momentTZ(
      item.appointment_pet_services[0].appointment_time.start_time
    )
      .tz("America/Mexico_City")
      .format("MMMM DD [-] HH:mm A");
    const service = item.appointment_pet_services[0].service.name;
    return (
      <TouchableOpacity
        style={styles.mainAppointmentContainer}
        onPress={() => goToResume(item)}
      >
        <View style={styles.imageInfoContainer}>
          <Image
            source={require("../../../assets/calendar-icon-date.png")}
            style={styles.imageCalendar}
          />
          <View style={styles.appointmentInfo}>
            <Text text70BL>{dateFormated}</Text>
            <Text style={styles.petBreed}>{service}</Text>
          </View>
        </View>
        <View style={styles.checkAndArrow}>
          <Icon name="check" size={25} color={Colors.primaryColor} />
          <Icon name="chevron-right" size={35} color={Colors.primaryColor} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      <>
        {existAppointment ? (
          <View style={styles.container}>
            <View style={styles.header}>
              <Image
                source={{ uri: pet.picture }}
                style={styles.profileImage}
              />
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petBreed}>{pet.pet_breed.description}</Text>
              </View>
            </View>
            <View style={styles.appointments}>
              <View style={styles.appointmentContainer}>
                <Text style={styles.titleAppointment}>Citas</Text>
                <TouchableOpacity
                  style={styles.newAppointment}
                  onPress={goToExplore}
                >
                  <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.newAppointment}
                  >
                    <Text style={styles.newAppointmentText}>Nueva +</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={styles.appointmentsList}>
                <FlatList
                  data={appointment}
                  renderItem={({ item }) => renderItem(item)}
                  keyExtractor={(item) => item.id}
                  style={styles.flatList}
                />
              </View>
            </View>
          </View>
        ) : (
          <NoDates />
        )}
      </>
    </>
  );
};

export default PetDate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  petInfo: {
    marginLeft: "5%",
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  petName: {
    fontSize: 30,
    fontWeight: "900",
  },
  petBreed: {
    color: Colors.gray,
    marginTop: 5,
  },
  appointments: {
    marginTop: "10%",
    padding: 5,
  },
  appointmentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleAppointment: {
    fontSize: 16,
    fontWeight: "700",
  },
  newAppointment: {
    borderRadius: 65,
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  newAppointmentText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  appointmentsList: {
    marginTop: 30,
  },
  imageCalendar: {
    width: 24,
    height: 26,
  },
  mainAppointmentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  imageInfoContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    width: "80%",
  },
  appointmentInfo: {
    alignItems: "flex-start",
  },
  checkAndArrow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
