import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Colors, gradientColors } from "../../../styles/Colors";
import NoDates from "./NoDates";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


const PetDate = ({ navigation, route }) => {
  const { pet, visible } = route.params;

  useEffect(() => {
    console.log("pet: ", pet);
  }, []);

  const goToExplore = () => {
    navigation.navigate("Explore")
  }

  const goToResume = () =>{
    navigation.navigate("ResumeAppointment")
  }

  return (
    <>
      {visible ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={{ uri: pet.picture }} style={styles.profileImage} />
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petBreed}>{pet.pet_breed.description}</Text>
            </View>
          </View>
          <View style={styles.appointments}>
            <View style={styles.appointmentContainer}>
              <Text style={styles.titleAppointment}>Citas</Text>
              <TouchableOpacity style={styles.newAppointment} onPress={goToExplore}>
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
              <TouchableOpacity style={styles.mainAppointmentContainer} onPress={goToResume}>
                <View style={styles.imageInfoContainer}>
                  <Image
                    source={require("../../../assets/calendar-icon-date.png")}
                    style={styles.imageCalendar}
                  />
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.titleAppointment}>
                      Abril 13 - 04:00 PM
                    </Text>
                    <Text style={styles.petBreed}>Desparasitación</Text>
                  </View>
                </View>
                <View style={styles.checkAndArrow}>
                  <Icon name="check" size={25} color={Colors.primaryColor} />
                  <Icon
                    name="chevron-right"
                    size={35}
                    color={Colors.primaryColor}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mainAppointmentContainer} onPress={goToResume}>
                <View style={styles.imageInfoContainer}>
                  <Image
                    source={require("../../../assets/calendar-icon-date.png")}
                    style={styles.imageCalendar}
                  />
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.titleAppointment}>
                      Abril 13 - 04:00 PM
                    </Text>
                    <Text style={styles.petBreed}>Desparasitación</Text>
                  </View>
                </View>
                <View style={styles.checkAndArrow}>
                  <Icon name="check" size={25} color={Colors.primaryColor} />
                  <Icon
                    name="chevron-right"
                    size={35}
                    color={Colors.primaryColor}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <NoDates />
      )}
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
    fontSize: 18,
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
    gap: 15,
    alignItems: "center",
  },
  appointmentInfo: {
    alignItems: "flex-start",
  },
  checkAndArrow: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
});
