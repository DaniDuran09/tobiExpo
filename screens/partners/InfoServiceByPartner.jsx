import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  CheckBox,
  Touchable,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../styles/Colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import vetOption4 from "../../assets/vet-option4.png";
import vetOption5 from "../../assets/vet-option5.png";
import DatePicker from "react-native-date-picker";
import { useNavigation } from "@react-navigation/native";
import { Checkbox } from "react-native-ui-lib";

const InfoServiceByPartner = ({ route }) => {
  const { partner, services } = route.params;
  const [selectedServices, setSelectedServices] = useState([]);
  const [isCheked, setIsChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [infoDate, setInfoDate] = useState({
    date: "",
    time: "",
  });

  console.log("Lo que recibo: ", partner);

  const navigation = useNavigation();

  const goToResume = () => {
    navigation.navigate("ResumeDateByPartner");
  };

  const toggleServiceSelection = (service) => {
    setSelectedServices((prevSelected) => {
      return prevSelected.includes(service)
        ? prevSelected.filter((s) => s !== service)
        : [...prevSelected, service];
    });
  };

  const renderServices = (item) => {
    const isChecked = selectedServices.includes(item);
    return (
      <View style={styles.option}>
        <View style={styles.mainContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.imageContainer}>
            <Image source={vetOption5} style={styles.image} />
            <View style={{ width: "80%" }}>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{item.price}</Text>
              </View>
            </View>
          </View>
        </View>
        <View>
          <Checkbox
            color={Colors.primaryColor}
            value={isChecked}
            onValueChange={() => toggleServiceSelection(item)}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: partner?.picture }}
          width={100}
          height={100}
          resizeMode="cover"
          borderRadius={100}
        />
        <Text style={styles.partnerName}>{partner?.display_name}</Text>
        <Text style={styles.partnerDescription}>Descripción pendiente</Text>
        <Text style={styles.partnerCertification}>
          Pendiente Céd. Prof. 123456
        </Text>
      </View>
      <View>
        <Text style={styles.mainTitle}>Agendar cita</Text>
      </View>
      <View style={styles.servicesContainer}>
        <FlatList
          keyExtractor={(item, index) => `item-${index}`}
          data={services}
          renderItem={({ item }) => renderServices(item)}
        />
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
                source={require("../../assets/calendar-icon-black.png")}
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
                {infoDate.date === "" ? "Selecciona una hora" : `${time}`}
              </Text>
              <Image
                source={require("../../assets/clock-icon-black.png")}
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

export default InfoServiceByPartner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  partnerName: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 5,
    marginBottom: 5,
  },
  partnerDescription: {
    textAlign: "center",
    marginBottom: 5,
  },
  partnerCertification: {
    fontSize: 12,
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 18,
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
});
