import { Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../../styles/Colors";
import vetOption1 from "../../../assets/vet-option1.png";
import calendar from "../../../assets/calendar-icon-date.png";
import marker from "../../../assets/marker-icon.png";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import momentTZ from "../../../utils/moment";
import { DateTimePicker, Text, View } from "react-native-ui-lib";

const ChangeDate = ({ route }) => {
  const { info } = route.params;
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [infoDate, setInfoDate] = useState({
    date: "",
    time: "",
  });

  const combinedDateTime = momentTZ(info?.appointment_time?.start_time);

  const formattedDateTime = combinedDateTime.format(
    "dddd D [de] MMMM, h:mm [hrs]"
  );

  const capitalizedDateTime =
    formattedDateTime.charAt(0).toUpperCase() + formattedDateTime.slice(1);

  const minimumDate = new Date();

  console.log("info: ", info);
  return (
    <ScrollView style={styles.container}>
    <View flex backgroundColor={Colors.white}>
      <View style={styles.header}>
        <Text style={styles.title}>Cambiar fecha</Text>
        <Image
          source={require("../../../assets/edit-date.png")}
          style={styles.editIcon}
        />
      </View>
      <View style={styles.especialistContainer}>
        <Image
          source={{ uri: info?.user?.picture }}
          style={styles.profileImage}
        />
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{info?.user?.name}</Text>
          <Text style={styles.petBreed}>Falta descripción</Text>
          <Text style={[styles.petBreed, { textDecorationLine: "underline" }]}>
            Ver más
          </Text>
        </View>
      </View>
      <View marginT-20 marginB-15 style={styles.servicesContainer}>
        <View style={styles.section}>
          <Text text70BO>Servicio</Text>
          <View marginT-10 style={styles.rowSection}>
            <Image
              source={vetOption1}
              style={styles.image}
              resizeMode="contain"
            />
            <Text text80>{info?.service?.name}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text text70BO>Día y hora</Text>
          <View marginT-10 style={styles.rowSection}>
            <Image
              source={calendar}
              style={styles.image}
              resizeMode="contain"
            />
            <Text text80>{capitalizedDateTime}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text text70BO>Dirección</Text>
          <View marginT-10 style={styles.rowSection}>
            <Image source={marker} style={styles.image} resizeMode="contain" />
            <Text text80>Dirección pendiente</Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={styles.title}>Fecha y hora</Text>
        <View row spread style={styles.textInput}>
          <DateTimePicker
            minimumDate={minimumDate}
            style={{ height: 60, width: 300 }}
            placeholder={"Selecciona el día"}
            mode={"date"}
            // onChange={(date) => setInfoDate({ ...infoDate, date: date })}
          />
          <Image
            source={require("../../../assets/calendar-icon-black.png")}
            style={{ height: 25, width: 25 }}
            resizeMode={"contain"}
          />
        </View>

        <View row spread style={styles.textInput}>
          <DateTimePicker
            style={{ height: 60, width: 300 }}
            placeholder={"Selecciona una hora"}
            mode={"time"}
            // onChange={(time) => {
            //   if (isTimeAllowed(time))
            //     setInfoDate({ ...infoDate, time: time });
            //   else
            //     Toast.show({
            //       type: "error",
            //       text1: "Hora inválida",
            //       text2: `Selecciona un hora válida`,
            //     });
            // }}
          />
          <Image
            source={require("../../../assets/clock-icon-black.png")}
            style={{ height: 25, width: 25 }}
            resizeMode={"contain"}
          />
        </View>
      </View>
      <View flex bottom>
        <TouchableOpacity style={styles.saveButton}>
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
    width: "100%",
    height: 60,
    borderWidth: 0.5,
    borderColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },
  textButton: {
    fontSize: 18,
    color: Colors.primaryColor,
    fontWeight: "600",
  },
});
