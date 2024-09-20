import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  CheckBox,
  Touchable,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../../styles/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import vetOption1 from "../../../assets/vet-option1.png";
import DatePicker from "react-native-date-picker";
import { useNavigation } from "@react-navigation/native";

const InfoServiceForDate = ({ route }) => {
  const { item, title } = route.params;
  const [isCheked, setIsChecked] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openTime, setOpenTime] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [time, setTime] = React.useState(null);
  const [infoDate, setInfoDate] = useState({
    date: "",
    time: ""
  });

  const navigation = useNavigation()

  const goToResume = () => {
    navigation.navigate("Resume")
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>{title}</Text>
      <View style={styles.servicesContainer}>
        <View style={styles.option}>
          <View style={styles.mainContainer}>
            <Text style={styles.title}>Vacuna antirrabica</Text>
            <View style={styles.imageContainer}>
              <Image source={vetOption1} style={styles.image} />
              <View>
                <Text style={styles.description}>
                  Se recomienda a las doce semanas de vida, con revacunación
                  anual.
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>$150.55</Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            {isCheked ? (
              <TouchableOpacity
                style={styles.buttonChecked}
                onPress={() => setIsChecked(!isCheked)}
              >
                <Icon name="rectangle" size={25} color={"#F25455"} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buttonChecked}
                onPress={() => setIsChecked(!isCheked)}
              >
                <Icon name="rectangle-outline" size={25} color={Colors.white} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.option}>
          <View style={styles.mainContainer}>
            <Text style={styles.title}>Vacuna antirrabica</Text>
            <View style={styles.imageContainer}>
              <Image source={vetOption1} style={styles.image} />
              <View>
                <Text style={styles.description}>
                  Se recomienda a las doce semanas de vida, con revacunación
                  anual.
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>$150.55</Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            {isCheked ? (
              <TouchableOpacity
                style={styles.buttonChecked}
                onPress={() => setIsChecked(!isCheked)}
              >
                <Icon name="rectangle" size={25} color={"#F25455"} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buttonChecked}
                onPress={() => setIsChecked(!isCheked)}
              >
                <Icon name="rectangle-outline" size={25} color={Colors.white} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.option}>
          <View style={styles.mainContainer}>
            <Text style={styles.title}>Vacuna antirrabica</Text>
            <View style={styles.imageContainer}>
              <Image source={vetOption1} style={styles.image} />
              <View>
                <Text style={styles.description}>
                  Se recomienda a las doce semanas de vida, con revacunación
                  anual.
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>$150.55</Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            {isCheked ? (
              <TouchableOpacity
                style={styles.buttonChecked}
                onPress={() => setIsChecked(!isCheked)}
              >
                <Icon name="rectangle" size={25} color={"#F25455"} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buttonChecked}
                onPress={() => setIsChecked(!isCheked)}
              >
                <Icon name="rectangle-outline" size={25} color={Colors.white} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.title}>Fecha y hora</Text>
        <View style={styles.endContainer}>
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
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "black",
                  fontWeight: "500",
                  paddingVertical: 10,
                }}
              >
                {infoDate.date === ""
                  ? "Selecciona el día"
                  : `${date.toLocaleDateString("es-us")}`}
              </Text>
              <Image
                source={require("../../../assets/calendar-icon-black.png")}
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
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "black",
                  fontWeight: "500",
                  paddingVertical: 10,
                }}
              >
                {infoDate.date === ""
                  ? "Selecciona una hora"
                  : `${time}`}
              </Text>
              <Image
                source={require("../../../assets/clock-icon-black.png")}
                style={{ height: 25, width: 25 }}
                resizeMode={"contain"}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={goToResume}>
            <Text style={styles.textButton}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    fontWeight: "400",
  },
  servicesContainer: {
    marginTop: "8%",
    borderRadius: 16,
    borderColor: Colors.blue,
    borderWidth: 1.5,
    padding: 15,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 10,
    marginRight: 30
  },
  buttonChecked: {
    borderWidth: 0.5,
    borderColor: Colors.gray,
  },
  image: {
    width: 20,
    height: 20,
  },
  imageContainer: {
    flexDirection: "row",
    gap: 10,
  },
  mainContainer: {},
  priceContainer: {
    borderWidth: 0.7,
    borderColor: Colors.primaryColor,
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    marginTop: 5,
  },
  price: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.primaryColor,
  },
  dateContainer: {
    marginTop: 20,
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
  saveButton: {
    marginTop: 50,
    width: "90%",
    height: 60,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 50
  },
  textButton: {
    fontSize: 18,
    color: Colors.gray,
    fontWeight: "600",
  },
});
