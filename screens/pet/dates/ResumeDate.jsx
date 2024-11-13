import {
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Linking,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../../styles/Colors";
import vetOption1 from "../../../assets/vet-option1.png";
import calendar from "../../../assets/calendar-icon-date.png";
import location from "../../../assets/location-icon.png";
import especialist from "../../../assets/vet-option5.png";
import parking from "../../../assets/parking.png";
import phone from "../../../assets/phone-icon.png";
import { ScrollView } from "react-native-gesture-handler";
import MapViewComponent from "../../partners/MapViewComponent";
import momentTZ from "../../../utils/moment";
import { ActionSheet, Text } from "react-native-ui-lib";

const ResumeDate = ({ navigation, route }) => {
  const { item } = route.params;
  console.log("Esto estoy recibiendo: ", item.appointment_pet_services);
  const dateFormated = momentTZ(
    item.appointment_pet_services[0].appointment_time.start_time
  ).format("dddd D [de] MMMM, h:mm [hrs]");

  const [showActionSheet, setShowActionSheet] = useState(false);

  const handleDirections = () => {
    setShowActionSheet(true);
  };

  const handleOptionPress = (index) => {
    setShowActionSheet(false);
    if (index === 0) {
      openMap(item.partner.latitude, item.partner.longitude, "Google Maps");
    } else if (index === 1) {
      openMap(item.partner.latitude, item.partner.longitude, "Apple Maps");
    }
  };

  const openMap = (latitude, longitude, app) => {
    const location = `${latitude},${longitude}`;

    switch (app) {
      case "Google Maps":
        const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${location}&travelmode=driving`;
        Linking.openURL(googleUrl);
        break;
      case "Apple Maps":
        const appleUrl = `http://maps.apple.com/?daddr=${location}&dirflg=d`;
        Linking.openURL(appleUrl);
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{padding: 15,}}>
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
              <Text style={styles.description}>
                {item.appointment_pet_services[0]?.user?.name}
              </Text>
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
              <Text style={styles.description}>
                {item?.appointment_pet_services[0]?.service?.name}
              </Text>
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
                <Text style={styles.description}>{dateFormated}</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ChangeDate", {
                      info: item.appointment_pet_services[0],
                    })
                  }
                >
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
              <MapViewComponent
                latitude={item.partner.latitude}
                longitude={item.partner.longitude}
                title={item.partner.name}
                description={item.partner.description}
              />
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.textSection}>Dirección</Text>
            <TouchableOpacity onPress={handleDirections}>
              <View style={styles.rowSection}>
                <Image
                  source={location}
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
                <Text style={styles.changeDate}>Dirección pendiente</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.section}>
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
          </View> */}
          <View style={styles.section}>
            <Text style={styles.textSection}>Teléfono</Text>
            <View style={styles.rowSection}>
              <Image source={phone} style={styles.image} resizeMode="cover" />
              <Text style={styles.description}>{item.partner.phone}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <ActionSheet
        useNativeIOS={Platform.OS == "ios"}
        visible={showActionSheet}
        title={"Abrir en..."}
        message={"Elige una aplicación para ver la ubicación"}
        cancelButtonIndex={2}
        onDismiss={() => setShowActionSheet(false)}
        destructiveButtonIndex={0}
        options={[
          { label: "Google Maps", onPress: () => handleOptionPress(0) },
          Platform.OS == "ios" && {
            label: "Maps",
            onPress: () => handleOptionPress(1),
          },
          { label: "Cancelar", onPress: () => setShowActionSheet(false) },
        ]}
      />
    </View>
  );
};

export default ResumeDate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
