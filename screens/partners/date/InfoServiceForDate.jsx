import { ActivityIndicator, FlatList, ScrollView, StyleSheet } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Colors } from "../../../styles/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AnimatedImage, LoaderScreen, Text, View } from "react-native-ui-lib";
import Toast from "react-native-toast-message";
import ApiFetcher from "../../../modules/ApiFetcher";
import { addAppointment } from "../../../redux/slice/appointmentSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomCalendar from "../../../components/appointments/CustomCalendar";
import AppStorage from "../../../modules/AppStorage";
import Loading from "../../../components/Loading";
import { RenderUsers } from "../../../components/renders/RenderUsers";
import { RenderServices } from "../../../components/renders/RenderServices";
import { RenderPets } from "../../../components/renders/RenderPets";
import momentTZ from "../../../utils/moment";


const InfoServiceForDate = ({ route }) => {
  const { users, partnerId, partnerLocation, specialist } = route.params;
  const service = useSelector((state) => state?.appointment?.service);

  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [availabilityDays, setAvailabilityDays] = useState([]);
  const [pets, stePets] = useState([]);
  const [infoDate, setInfoDate] = useState({
    date: "",
    time: "",
  });
  const appStorage = new AppStorage();
  const [specialistId, setSpecialistId] = useState();

  const disabledSelectDate = useMemo(
    () => !(specialistId && selectedPet && selectedServices),
    [specialistId, selectedPet, selectedServices]
  );

  const formatDate = useMemo(() => {
    if (!infoDate.date || !infoDate.time) return "";
    const [startTime] = infoDate.time.split(" - ");
    const dateTime = `${infoDate.date}T${startTime}`;
    const formattedDate = momentTZ(dateTime).locale("es").format("dddd D [de] MMMM [de] YYYY, h:mm A");
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }, [infoDate]);
  

  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const apiFetcher = new ApiFetcher();

  useFocusEffect(
    useCallback(() => {
      if (specialist) setSpecialistId(specialist.id);
      fetchPets();
      return () => { };
    }, [])
  );

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await apiFetcher.getPets();
      stePets(response.data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceSelection = (service) => {
    setSelectedServices((prevSelected) => {
      return prevSelected.includes(service)
        ? prevSelected.filter((s) => s !== service)
        : [...prevSelected, service];
    });
  };

  const handleSelectPet = (pet) => setSelectedPet(pet);

  const goToResume = async () => {
    if (
      infoDate.date == "" ||
      infoDate.time == "" ||
      selectedServices.length < 1 ||
      !selectedPet ||
      !selectedServices ||
      !specialistId
    ) {
      Toast.show({
        type: "error",
        text1: "Datos incompletos",
        text2: `Completa todos los campos`,
      });
    } else {
      setLoading(true);
      try {
        const user = await appStorage.getUser();

        const payload = {
          appointment: {
            partner_id: partnerId,
            user_id: user.id,
            name: user.name,
            description: "",
            date_service: infoDate.date,
            appointment_pet_services_attributes: [],
          },
        };
        selectedServices.forEach((service) => {
          payload.appointment.appointment_pet_services_attributes.push({
            pet_id: selectedPet.id,
            service_id: service.id,
            user_id: specialistId,
            start_time: infoDate.time,
          });
        });

        dispatch(
          addAppointment({
            pet: selectedPet,
            date: infoDate.date,
            time: infoDate.time,
            service: selectedServices,
            partenerLocation: partnerLocation,
          })
        );

        navigation.navigate("Resume", { payload: payload });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Ocurrió un error inesperado",
          text2: `Intenta de nuevo más tarde`,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  console.log("infoDate: ", infoDate)

  const getCalendar = async () => {
    setLoadingCalendar(true)
    try {
      const response = await apiFetcher.getAvailabilityDaysByPartnerId(
        specialistId
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
    } finally {
      setLoadingCalendar(false)
    }
  };

  const closeModal = () => setShowCalendar(false);

  return (
    <View flex backgroundColor={Colors.white}>
      {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      <ScrollView ref={scrollViewRef}>
        <View>
          {specialist && (
            <>
              <View center margin-20>
                <AnimatedImage
                  source={{ uri: specialist?.picture }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 64,
                  }}
                  loader={
                    <LoaderScreen color={Colors.primaryColor} size={35} />
                  }
                  animationDuration={500}
                  resizeMode="cover"
                />
                <View marginT-10 center>
                  <Text>{specialist?.display_name}</Text>
                  <Text>Descripción pendiente</Text>
                  <Text>Pendiente Céd. Prof. 123456</Text>
                </View>
              </View>
              <View
                margin-10
                marginH-0
                borderBottomWidth={0.3}
                borderColor={Colors.gray}
              />
            </>
          )}

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
        </View>
        <View
          margin-10
          marginH-0
          borderBottomWidth={0.2}
          borderColor={Colors.gray}
        />
        <View flex padding-16>
          <Text text70BL>Agendar cita</Text>

          <View marginT-10 style={styles.servicesContainer}>
            <FlatList
              keyExtractor={(item, index) => `item-${index}`}
              data={service}
              renderItem={({ item }) => (
                <RenderServices
                  item={item}
                  selectedServices={selectedServices}
                  toggleServiceSelection={toggleServiceSelection}
                />
              )}
            />
          </View>
          {!specialist && (
            <View marginT-20 marginB-20>
              <Text text70BO marginB-10>
                Especialistas{" "}
              </Text>
              <FlatList
                data={users}
                horizontal={true}
                renderItem={({ item }) => (
                  <RenderUsers
                    specialistId={specialistId}
                    user={item}
                    setSpecialistId={setSpecialistId}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
          <View marginT-20 marginB-20>
            <Text text70BO>Fecha y hora</Text>
            <View>
              <TouchableOpacity
                disabled={disabledSelectDate || loadingCalendar}
                onPress={getCalendar}
              >
                {!loadingCalendar ?
                  <View row spread style={styles.textInput}>
                    <Text>{infoDate.date && infoDate.time ?
                      formatDate
                      : "Selecciona una fecha"}</Text>
                  </View>
                  :
                  <View style={styles.textInput} center>
                    <ActivityIndicator size="small" color={Colors.primaryColor} />
                  </View>
                }
              </TouchableOpacity>
            </View>
            <View>
              <CustomCalendar
                showCalendar={showCalendar}
                closeModal={closeModal}
                setInfoDate={setInfoDate}
                infoDate={infoDate}
                availabilityDays={availabilityDays}
                specialistId={specialistId}
                selectedServices={selectedServices}
              />
            </View>
          </View>
          <View flex bottom>
            <TouchableOpacity style={styles.saveButton} onPress={goToResume}>
              <Text style={styles.textButton}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  personImage: {
    height: 60,
    width: 60,
    borderRadius: 32,
  },
  saveButton: {
    width: "100%",
    height: 60,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  textButton: {
    fontSize: 18,
    color: Colors.gray,
    fontWeight: "600",
  },
});
