import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../styles/Colors";
import vetOption5 from "../../assets/vet-option5.png";
import calendar from "../../assets/calendar-icon-date.png";
import location from "../../assets/location-icon.png";
import parking from "../../assets/parking.png";
import phone from "../../assets/phone-icon.png";
import card from "../../assets/card-icon.png";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

const ResumeDateByPartner = () => {
  const [existingCard, setExistingCard] = useState(false);
  const navigation = useNavigation();

  const viewMoreInfo = () => {
    setExistingCard(true);
    navigation.goBack();
  };

  const changeMethod = () => {
    console.log("Pendiente de generar la función");
  };

  const saveDate = () => {
    console.log("Pendiente de generar funcionalidad esperando al backend");
    Alert.alert(
      "Cita agendada con éxito",
      "Puedes consultar la información en el apartado de 'Mis citas'",
      [
        {
          text: "OK",
          onPress: () => {
            navigation.replace("PartnersMain");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const goToPaymentMethod = () => {
    navigation.navigate("AddNewCard", { executeFunction: viewMoreInfo });
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Resumen de la cita</Text>
          <Image
            source={require("../../assets/edit-date.png")}
            style={styles.editIcon}
          />
        </View>
        <View style={[styles.header, { marginTop: 25 }]}>
          <Image
            source={require("../../assets/testPerson.png")}
            style={styles.partnerImage}
          />
          <View>
            <Text style={styles.partnerName}>Dra. Dafne Villegas</Text>
            <Text>MVZ con especialidad en...</Text>
            <TouchableOpacity>
              <Text style={styles.viewMoreInfoText}>Ver más</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.servicesContainer}>
          <View style={styles.section}>
            <Text style={styles.textSection}>Servicio</Text>
            <View style={styles.rowSection}>
              <Image
                source={vetOption5}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.description}>Consulta general</Text>
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
              <Text style={styles.description}>
                Lunes 13 de febrero, 15:00 hrs
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.textSection}>Importe</Text>
            <View style={styles.rowSection}>
              <Text
                style={[
                  styles.description,
                  { color: Colors.primaryColor, fontSize: 25 },
                ]}
              >
                $
              </Text>
              <Text style={styles.description}>150.00</Text>
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
        {!existingCard ? (
          <>
            <Text style={styles.title}>Elige método de pago</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={goToPaymentMethod}
              >
                <Text style={styles.textButton}>Agregar método de pago</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.changeMethodContainer}>
              <Text style={styles.title}>Método de pago</Text>
              <TouchableOpacity onPress={changeMethod}>
                <Text style={styles.changeMethod}>Cambiar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.servicesContainer}>
              <Text style={styles.textSection}>Número de tarjeta</Text>
              <View style={styles.section}>
                <View style={styles.rowSection}>
                  <Image
                    source={card}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                  <Text style={styles.description}>**** **** **** 1234</Text>
                </View>
              </View>
            </View>
            <View style={styles.changeMethodContainer}>
              <Text style={styles.title}>Resumen</Text>
            </View>
            <View style={styles.servicesContainer}>
              <View style={styles.betweenContainer}>
                <Text style={styles.description}>
                  Vacuna antirrábica canina
                </Text>
                <Text style={styles.description}>$150.55</Text>
              </View>
              <View style={styles.betweenContainer}>
                <Text style={styles.description}>Tarifa de Servicio</Text>
                <Text style={styles.description}>$5.00</Text>
              </View>
              <View style={styles.betweenContainer}>
                <Text style={[styles.description, { fontWeight: "800" }]}>
                  Total a pagar
                </Text>
                <Text style={[styles.description, { fontWeight: "800" }]}>
                  $155.55
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.buttonNext} onPress={saveDate}>
              <Text style={styles.textButtonNext}>Continuar</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ResumeDateByPartner;

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
  partnerName: {
    fontSize: 16,
    fontWeight: "500",
  },
  partnerImage: {
    height: 60,
    width: 60,
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
  viewMoreInfoText: {
    textDecorationLine: "underline",
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
});
