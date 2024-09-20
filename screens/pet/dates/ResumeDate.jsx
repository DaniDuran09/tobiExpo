import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../../styles/Colors";
import vetOption1 from "../../../assets/vet-option1.png";
import calendar from "../../../assets/calendar-icon-date.png";
import location from "../../../assets/location-icon.png";
import especialist from "../../../assets/vet-option5.png";
import parking from "../../../assets/parking.png";
import phone from "../../../assets/phone-icon.png";
import card from "../../../assets/card-icon.png";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const ResumeDate = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Resumen de la cita</Text>
        </View>
        <View style={styles.servicesContainer}>
          <View style={styles.section}>
            <Text style={styles.textSection}>Especialista</Text>
            <View style={styles.rowSection}>
              <Image
                source={especialist}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.description}>Dra. Dafne Villegas</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.textSection}>Servicio</Text>
            <View style={styles.rowSection}>
              <Image
                source={vetOption1}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.description}>Vacuna antirrabica</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.textSection}>Día y hora</Text>
            <View style={styles.rowSection}>
              <Image
                source={calendar}
                style={styles.image}
                resizeMode="contain"
              />
              <View style={styles.changeContainer}>
                <Text style={styles.description}>
                  Lunes 13 de febrero, 15:00 hrs
                </Text>
                <TouchableOpacity onPress={()=> navigation.navigate("ChangeDate")}>
                  <Text style={styles.changeDate}>Cambiar fecha</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.servicesContainer}>
          <View style={styles.section}>
            <Text style={styles.textSection}>Pet Xclusive</Text>
            <View style={styles.mapCompanyContain}>
              {/* <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{ height: "85%", width: "100%", marginBottom: 15 }}
                region={{
                  latitude: parseFloat(19.4093655),
                  longitude: parseFloat(-99.171775),
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
              >
                <Marker
                  title={"El lugar"}
                  description={"item.partner.description"}
                  image={require("../../../assets/marker.png")}
                  coordinate={{
                    latitude: parseFloat(19.4093655),
                    longitude: parseFloat(-99.171775),
                  }}
                />
              </MapView> */}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.textSection}>Dirección</Text>
            <View style={styles.rowSection}>
              <Image
                source={location}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
              <Text style={styles.description}>
                Río Pánuco 168 - 160, Cuauhtémoc, CDMX, 06720.
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.textSection}>Estacionamiento</Text>
            <View style={styles.rowSection}>
              <Image
                source={parking}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
              <Text style={styles.description}>
                Estacionamiento en vía pública.
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.textSection}>Teléfono</Text>
            <View style={styles.rowSection}>
              <Image source={phone} style={styles.image} resizeMode="cover" />
              <Text style={styles.description}>55 555 5555</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ResumeDate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  editIcon: {
    width: 15,
    height: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  servicesContainer: {
    marginTop: "8%",
    borderRadius: 16,
    borderColor: Colors.blue,
    borderWidth: 1.5,
    padding: 15,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  image: {
    width: 25,
    height: 25,
  },
  textSection: {
    fontSize: 18,
    fontWeight: "700",
  },
  rowSection: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: "70%",
  },
  description: {
    fontSize: 16,
  },
  saveButton: {
    marginTop: 30,
    width: "100%",
    height: 60,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  textButton: {
    fontSize: 18,
    color: Colors.gray,
    fontWeight: "600",
  },
  changeMethod: {
    color: Colors.gray,
    fontSize: 16,
  },
  changeMethodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  betweenContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  buttonNext: {
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  textButtonNext: {
    color: Colors.primaryColor,
    fontWeight: "900",
    fontSize: 16,
  },
  mapCompanyContain: {
    alignItems: "center",
    maxHeight: 240,
    marginTop: 10,
  },
  changeDate: {
    color: "#2269C5",
    fontSize: 14,
    fontWeight: "800",
  },
});
