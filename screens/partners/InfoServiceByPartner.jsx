import {
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Colors } from "../../styles/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native-ui-lib";
import { RenderServices } from "../../components/renders/RenderServices";
import ApiFetcher from "../../modules/ApiFetcher";
import CustomCalendar from "../../components/appointments/CustomCalendar";
import { RenderPets } from "../../components/renders/RenderPets";

const InfoServiceByPartner = ({ route }) => {

  const apiFetcher = new ApiFetcher()

  const { partner, services } = route.params;
  const [selectedServices, setSelectedServices] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [availabilityDays, setAvailabilityDays] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [pets, setPets] = useState([]);
  const [infoDate, setInfoDate] = useState({
    date: "",
    time: "",
  });

  useEffect(() => {
    fetchPets()
  }, [])
  

  const navigation = useNavigation();

  const disabledSelectDate = useMemo(
    () => !(partner && selectedServices),
    [partner, selectedServices]
  );

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

  const fetchPets = async () => {
    console.log("ENTRO")
    // setLoading(true);
    try {
      const response = await apiFetcher.getPets();
      setPets(response.data);
      console.log("me ejecuto")
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      // setLoading(false);
    }
  };

  const getCalendar = async () => {
    try {
      const response = await apiFetcher.getAvailabilityDaysByPartnerId(
        partner.id
      );
      setAvailabilityDays(response.available_days);
      setShowCalendar(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ocurrió un error inesperado",
        text2: `Intenta de nuevo más tarde`,
      });
      setShowCalendar(false);
    }
  };

  const handleSelectPet = (pet) => setSelectedPet(pet);

  const closeModal = () => setShowCalendar(false);

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
      <View padding-16>
            <FlatList
              data={pets}
              horizontal={true}
              renderItem={({ item }) => (
                <RenderPets
                  pet={item}
                  selectedPet={selectedPet}
                  handleSelectPet={handleSelectPet}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        <Text style={styles.mainTitle}>Agendar cita</Text>
      </View>
      <View marginT-10 style={styles.servicesContainer}>
            <FlatList
              keyExtractor={(item, index) => `item-${index}`}
              data={services}
              renderItem={({ item }) => (
                <RenderServices
                  item={item}
                  selectedServices={selectedServices}
                  toggleServiceSelection={toggleServiceSelection}
                />
              )}
            />
          </View>
      <View style={styles.dateContainer}>
      <View marginT-20 marginB-20>
            <Text text70BO>Fecha y hora</Text>
            <View>
              <TouchableOpacity
                disabled={disabledSelectDate}
                onPress={getCalendar}
              >
                <View row spread style={styles.textInput}>
                  <Text>Selecciona una fecha</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <CustomCalendar
                showCalendar={showCalendar}
                closeModal={closeModal}
                setInfoDate={setInfoDate}
                infoDate={infoDate}
                availabilityDays={availabilityDays}
                specialistId={1}
                selectedServices={selectedServices}
              />
            </View>
          </View>
        {/* <View style={styles.endContainer}>
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
        </View> */}
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
