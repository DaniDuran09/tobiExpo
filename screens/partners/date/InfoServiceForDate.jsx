import { Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../../styles/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import vetOption1 from "../../../assets/vet-option1.png";
import { useNavigation } from "@react-navigation/native";
import { Checkbox, DateTimePicker, Text, View } from "react-native-ui-lib";
import Toast from "react-native-toast-message";

const InfoServiceForDate = ({ route }) => {
  const { service, partenerLocation } = route.params;
  const [isCheked, setIsChecked] = useState(false);
  const [infoDate, setInfoDate] = useState({
    date: "",
    time: "",
  });

  const navigation = useNavigation();

  const goToResume = () => {
    if (infoDate.date == "" || infoDate.time == "" || !isCheked) {
      Toast.show({
        type: "error",
        text1: "Datos incompletos",
        text2: `Completa todos los campos`,
      });
    } else
      navigation.navigate("Resume", {
        infoDate: infoDate,
        service: service,
        partenerLocation: partenerLocation,
      });
  };

  console.log("service: ", service);

  const minimumDate = new Date(); // Fecha actual
  minimumDate.setHours(0, 0, 0, 0); // Establecer la hora a medianoche

  // Limites para las horas (no permitir horas entre las 8 PM y las 8 AM)
  const isTimeAllowed = (selectedDate) => {
    const hours = selectedDate.getHours();
    return !(hours >= 20 || hours < 8); // 8 PM (20) a 8 AM (8)
  };

  return (
    <View flex backgroundColor={Colors.white} padding-16>
      <Text text50BL>{service?.name}</Text>
      <View marginT-30 style={styles.servicesContainer}>
        <View row spread>
          <View>
            <Text text70BO>{service?.name}</Text>
            <View row spread gap-10 marginT-5>
              <Image source={vetOption1} style={styles.image} />
              <View>
                <Text>{service?.description}</Text>
                <View
                  center
                  padding-5
                  width={80}
                  marginT-10
                  style={styles.priceContainer}
                >
                  <Text text90BO color={Colors.primaryColor}>
                    ${service?.price}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            <Checkbox
              color={Colors.primaryColor}
              value={isCheked}
              onValueChange={(checked) => {
                setIsChecked(checked);
              }}
            />
          </View>
        </View>
      </View>
      <View marginT-20>
        <Text text70BO>Fecha y hora</Text>
        <View>
          <View row spread style={styles.textInput}>
            <DateTimePicker
              minimumDate={minimumDate}
              style={{ height: 60, width: 300 }}
              placeholder={"Selecciona el día"}
              mode={"date"}
              onChange={(date) => setInfoDate({ ...infoDate, date: date })}
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
              onChange={(time) => {
                if (isTimeAllowed(time))
                  setInfoDate({ ...infoDate, time: time });
                else
                  Toast.show({
                    type: "error",
                    text1: "Hora inválida",
                    text2: `Selecciona un hora válida`,
                  });
              }}
            />
            <Image
              source={require("../../../assets/clock-icon-black.png")}
              style={{ height: 25, width: 25 }}
              resizeMode={"contain"}
            />
          </View>
        </View>
      </View>
      <View flex bottom>
        <TouchableOpacity style={styles.saveButton} onPress={goToResume}>
          <Text style={styles.textButton}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InfoServiceForDate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "800",
  },
  servicesContainer: {
    borderRadius: 16,
    borderColor: Colors.blue,
    borderWidth: 1.5,
    padding: 15,
  },
  option: {},
  buttonChecked: {
    borderWidth: 0.5,
    borderColor: Colors.gray,
  },
  image: {
    width: 20,
    height: 20,
  },
  priceContainer: {
    borderWidth: 0.7,
    borderColor: Colors.primaryColor,
  },
  textInput: {
    backgroundColor: Colors.lightBlue,
    alignItems: "center",
    paddingHorizontal: "5%",
    borderRadius: 4,
    height: 60,
    marginTop: "5%",
  },
  saveButton: {
    marginTop: 50,
    width: "90%",
    height: 60,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 50,
  },
  textButton: {
    fontSize: 18,
    color: Colors.gray,
    fontWeight: "600",
  },
});
