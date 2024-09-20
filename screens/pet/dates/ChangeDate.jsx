import { Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../../styles/Colors";
import vetOption1 from "../../../assets/vet-option1.png";
import calendar from "../../../assets/calendar-icon-date.png";
import marker from "../../../assets/marker-icon.png";
import DatePicker from "react-native-date-picker";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

const ChangeDate = () => {
  const [open, setOpen] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [infoDate, setInfoDate] = useState({
    date: "",
    time: "",
  });
  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>Cambiar fecha</Text>
          <Image
            source={require("../../../assets/edit-date.png")}
            style={styles.editIcon}
          />
        </View>
        <View style={styles.especialistContainer}>
          <Image
            source={require("../../../assets/testPerson.png")}
            style={styles.profileImage}
          />
          <View style={styles.petInfo}>
            <Text style={styles.petName}>Dra. Dafne Villegas</Text>
            <Text style={styles.petBreed}>MVZ con especialidad en...</Text>
            <Text
              style={[styles.petBreed, { textDecorationLine: "underline" }]}
            >
              Ver más
            </Text>
          </View>
        </View>
        <View style={styles.servicesContainer}>
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
              <Text style={styles.description}>
                Lunes 13 de febrero, 15:00 hrs
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.textSection}>Dirección</Text>
            <View style={styles.rowSection}>
              <Image
                source={marker}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.description}>
                Río Pánuco 168 - 160, Cuauhtémoc, CDMX, 06720.
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.title}>Fecha y hora</Text>

          <TouchableOpacity onPress={() => setOpen(true)}>
            <View elevation={5} style={styles.textInput}>
              <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date) => {
                  setInfoDate({ ...infoDate, date: date });
                  setOpen(false);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
                locale={"es"}
                mode={"date"}
                title={"Cumpleaños"}
              />
              <Text style={styles.textDate}>
                {infoDate.date === ""
                  ? "Selecciona el día"
                  : `${date.toLocaleDateString("es-us")}`}
              </Text>
              <Image
                source={require("../../../assets/calendar-icon-red.png")}
                style={{ height: 25, width: 25 }}
                resizeMode={"contain"}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOpenTime(true)}>
            <View elevation={5} style={styles.textInput}>
              <DatePicker
                modal
                open={openTime}
                date={date}
                onConfirm={(time) => {
                  setInfoDate({ ...infoDate, time: time });
                  setOpenTime(false);
                }}
                onCancel={() => {
                  setOpenTime(false);
                }}
                mode={"time"}
                title={"Hora"}
              />
              <Text style={styles.textDate}>
                {infoDate.time === "" ? "Selecciona una hora" : `${time}`}
              </Text>
              <Image
                source={require("../../../assets/clock-icon-red.png")}
                style={{ height: 25, width: 25 }}
                resizeMode={"contain"}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            // onPress={}
          >
            <Text style={styles.textButton}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ChangeDate;

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
  especialistContainer: {
    marginTop: "6%",
    flexDirection: "row",
  },
  petInfo: {
    marginLeft: "5%",
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  petName: {
    fontSize: 26,
    fontWeight: "600",
  },
  petBreed: {
    color: Colors.gray,
    marginTop: 5,
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
  textInput: {
    width: "100%",
    backgroundColor: Colors.lightBlue,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "5%",
    borderRadius: 4,
    height: 60,
    marginTop: "5%",
  },
  textDate: {
    textAlign: "center",
    fontSize: 15,
    color: Colors.primaryColor,
    fontWeight: "500",
    paddingVertical: 10,
  },
  saveButton: {
    marginTop: 50,
    width: "100%",
    height: 60,
    borderWidth: 0.5,
    borderColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  textButton: {
    fontSize: 18,
    color: Colors.primaryColor,
    fontWeight: "600",
  },
});
