import { FlatList, Image, ScrollView, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Colors } from "../../../styles/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import vetOption1 from "../../../assets/vet-option1.png";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  AnimatedImage,
  Checkbox,
  DateTimePicker,
  LoaderScreen,
  Text,
  View,
} from "react-native-ui-lib";
import Toast from "react-native-toast-message";
import ApiFetcher from "../../../modules/ApiFetcher";
import { addAppointment } from "../../../redux/slice/appointmentSlice";
import { useDispatch, useSelector } from "react-redux";
import CustomCalendar from "../../../components/appointments/CustomCalendar";

const InfoServiceForDate = ({ route }) => {
  const {users} = route.params;
  const service = useSelector((state) => state?.appointment?.service);
  const [isCheked, setIsChecked] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [pets, stePets] = useState([]);
  const [infoDate, setInfoDate] = useState({
    date: "",
    time: "",
  });
  const [specialistId,setSpecialistId]=useState()

  const minimumDate = new Date(); // Fecha actual
  minimumDate.setHours(0, 0, 0, 0); // Establecer la hora a medianoche

  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const apiFetcher = new ApiFetcher();

  useFocusEffect(
    useCallback(() => {
      // console.log("resetseos")
      // if(route?.params){
      //   console.log("reseteo")
      //   console.log("reseteo")
      //   resetParams();
      // }
      fetchPets();
      return () => {};
    }, [])
  );

  const resetParams = () => {
    scrollToTop()
    setIsChecked(false);
    setSelectedServices([])
    setSelectedPet(null);
    setInfoDate({
      date: "",
      time: "",
    });
  };

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await apiFetcher.getPets();
      stePets(response.data);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: false });
  };

  const toggleServiceSelection = (service) => {
    setSelectedServices((prevSelected) => {
      return prevSelected.includes(service)
        ? prevSelected.filter((s) => s !== service)
        : [...prevSelected, service];
    });
  };

  const handleSelectPet = (pet) => setSelectedPet(pet);

  const renderPets = (pet) => {
    const isSelected = selectedPet?.id === pet.id;
    return (
      <TouchableOpacity onPress={() => handleSelectPet(pet)}>
        <View
          center
          marginR-25
          style={selectedPet && !isSelected && { opacity: 0.6 }}
        >
          <AnimatedImage
            source={{ uri: pet?.picture }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 64,
              borderWidth: isSelected ? 3 : 0,
              borderColor: isSelected ? Colors.primaryColor : "transparent",
            }}
            loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
            animationDuration={500}
            resizeMode="cover"
          />
          <Text color={isSelected && Colors.primaryColor} text70R>
            {pet?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const goToResume = () => {
    //console.log(infoDate)
    if (
      infoDate.date == "" ||
      infoDate.time == "" ||
      selectedServices.length < 1 ||
      !selectedPet
    ) {
      Toast.show({
        type: "error",
        text1: "Datos incompletos",
        text2: `Completa todos los campos`,
      });
    } else{
      dispatch(
        addAppointment({
          pet: selectedPet,
          date: infoDate.date,
          time: infoDate.time,
          service: selectedServices,
          partenerLocation: service.partenerLocation,
        })
      );
    navigation.navigate("Resume", {resetParams: resetParams});
  }
  };

  const closeModal = () => setShowCalendar(false)

  // Limites para las horas (no permitir horas entre las 8 PM y las 8 AM)
  const isTimeAllowed = (selectedDate) => {
    const hours = selectedDate.getHours();
    return !(hours >= 20 || hours < 8); // 8 PM (20) a 8 AM (8)
  };

  const renderServices = (item) => {
    const isChecked = selectedServices.includes(item);
    return (
      // <View style={styles.option}>
      //   <View style={styles.mainContainer}>
      //     <Text style={styles.title}>{item.name}</Text>
      //     <View style={styles.imageContainer}>
      //       <Image source={vetOption5} style={styles.image} />
      //       <View style={{ width: "80%" }}>
      //         <Text style={styles.description}>{item.description}</Text>
      //         <View style={styles.priceContainer}>
      //           <Text style={styles.price}>{item.price}</Text>
      //         </View>
      //       </View>
      //     </View>
      //   </View>
      //   <View>
      //     <Checkbox
      //       color={Colors.primaryColor}
      //       value={isChecked}
      //       onValueChange={() => toggleServiceSelection(item)}
      //     />
      //   </View>
      // </View>
      <View row spread marginB-40>
        <View>
          <Text text70BO>{item?.name}</Text>
          <View row spread gap-10 marginT-5>
            <Image source={vetOption1} style={styles.image} />
            <View>
              <Text>{item?.description}</Text>
              <View
                center
                padding-5
                width={80}
                marginT-10
                style={styles.priceContainer}
              >
                <Text text90BO color={Colors.primaryColor}>
                  ${item?.price}
                </Text>
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

  const renderUsers = (user) => {
    return (
      <TouchableOpacity
        onPress={()=>{setSpecialistId(user.id)
          
        }}
      >
        <View center marginR-25>
          <Image
            source={{ uri: user.picture }}
            style={styles.personImage}
            resizeMode="cover"
          />
          <Text text70R>{user.display_name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View flex backgroundColor={Colors.white}>
      <ScrollView ref={scrollViewRef}>
        <View>
          <View padding-16>
            <FlatList
              data={pets}
              horizontal={true}
              renderItem={({ item }) => renderPets(item)}
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
              renderItem={({ item }) => renderServices(item)}
            />
          </View>
          <View marginT-20 marginB-20>
          <Text text70BO marginB-10>Especialistas </Text>
          <FlatList
                      data={users}
                      horizontal={true}
                      renderItem={({ item }) => renderUsers(item)}
                      keyExtractor={(item) => item.id.toString()}
                      showsHorizontalScrollIndicator={false}

                    />
          </View>
          <View marginT-20 marginB-20>
            <Text text70BO>Fecha y hora</Text>
            <View>
              <TouchableOpacity onPress={()=>setShowCalendar(true)}> 
              <View row spread style={styles.textInput}>
               <Text>Selecciona una fecha</Text>
              </View>
              </TouchableOpacity>
              {/* <View row spread style={styles.textInput}>
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
              </View> */}
            </View>
            <View>
            <CustomCalendar showCalendar={showCalendar} closeModal={closeModal}/>
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
