import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../../styles/Colors";

const NoDates = () => {
  const navigation = useNavigation();

  const goToPartners = () => {
    navigation.navigate("Explore");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Aún no tienes citas programadas</Text>
      </View>
      <View style={styles.recommendation}>
        <Text style={styles.recommendationTitle}>Recomendación</Text>
        <Text style={styles.recommendationText}>
          Visitar a los profesionales en el cuidado de mascotas con regularidad
          es una parte importante para mantener su salud y bienestar.
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.otherContainer}>
          <TouchableOpacity
            style={styles.scheduleAppointmentButton}
            onPress={goToPartners}
          >
            <Text style={styles.textButton}>Agendar cita</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default NoDates;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        alignItems: "center",
      },
      headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10%",
      },
      headerText: {
        fontSize: 18,
        textAlign: "center",
        color: Colors.gray,
      },
      recommendation: {
        marginTop: "30%",
        width: "80%",
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: Colors.primaryColor,
        padding: 20,
      },
      recommendationTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 15,
      },
      recommendationText: {
        fontSize: 16,
        color: Colors.gray,
      },
      bottomContainer: {
        position: "absolute",
        bottom: "10%",
        width: "100%",
        alignItems: "center",
      },
      otherContainer: {
        width: "80%",
        alignItems: "center",
      },
      scheduleAppointmentButton: {
        borderWidth: 1,
        width: "100%",
        minWidth: Dimensions.get("screen").width - 60,
        borderColor: Colors.primaryColor,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        height: 60,
      },
      textButton: {
        fontSize: 16,
        fontWeight: "800",
        color: Colors.primaryColor
      },
});
