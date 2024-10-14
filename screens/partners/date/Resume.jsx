import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Colors } from "../../../styles/Colors";
import vetOption1 from "../../../assets/vet-option1.png";
import calendar from "../../../assets/calendar-icon-date.png";
import location from "../../../assets/location-icon.png";
import parking from "../../../assets/parking.png";
import phone from "../../../assets/phone-icon.png";
import card from "../../../assets/card-icon.png";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import PaymentScreen from "../../../components/appointments/PaymentScreen";
import { SkeletonView, Text, View } from "react-native-ui-lib";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import momentTZ from "../../../utils/moment";
import ApiFetcher from "../../../modules/ApiFetcher";

const Resume = ({ route }) => {
  const { infoDate, service, partenerLocation } = route.params;

  console.log("service: ", service);

  const apiFetcher = new ApiFetcher();

  const combinedDateTime = momentTZ(infoDate.date).set({
    hour: momentTZ(infoDate.time).hour(),
    minute: momentTZ(infoDate.time).minute(),
  });

  const formattedDateTime = combinedDateTime.format(
    "dddd D [de] MMMM, h:mm [hrs]"
  );

  const capitalizedDateTime =
    formattedDateTime.charAt(0).toUpperCase() + formattedDateTime.slice(1);

  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pets, stePets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await apiFetcher.getPets();
      stePets(response.data);
    } catch (error) {}
  };

  const handleSelectPet = (pet) => setSelectedPet(pet);

  const renderPets = (pet) => {
    const isSelected = selectedPet?.id === pet.id;
    return (
      <TouchableOpacity onPress={() => handleSelectPet(pet)}>
        <View center marginR-25>
          <Image
            source={{ uri: pet.picture }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 32,
              borderWidth: isSelected ? 3 : 0,
              borderColor: isSelected ? Colors.primaryColor : "transparent",
            }}
            resizeMode="cover"
          />
          <Text color={isSelected && Colors.primaryColor} text70R>
            {pet?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
    setExpanded(true);
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    setExpanded(false);
  };

  return (
    <View flex padding-15 backgroundColor={Colors.white}>
      <ScrollView style={expanded && { opacity: 0.1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Resumen de la cita</Text>
          <Image
            source={require("../../../assets/edit-date.png")}
            style={styles.editIcon}
          />
        </View>
        <View style={styles.servicesContainer}>
          <View style={styles.section}>
            <Text text70BO>Día y hora</Text>
            <View style={styles.rowSection}>
              <Image
                source={calendar}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.description}>{capitalizedDateTime}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text text70BO>Dirección</Text>
            <View style={styles.rowSection}>
              <Image
                source={location}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
              <Text style={styles.description}>{partenerLocation}</Text>
            </View>
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
            <Text text70BO>Teléfono</Text>
            <View style={styles.rowSection}>
              <Image source={phone} style={styles.image} resizeMode="cover" />
              <Text style={styles.description}>55 555 5555</Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.title}>Elege a tu mascota</Text>
          <View margin-20>
            <FlatList
              data={pets}
              horizontal={true}
              renderItem={({ item }) => renderPets(item)}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        <View>
          <Text style={styles.title}>Resumen</Text>
          <View style={styles.servicesContainer}>
            <Text text70BO>Productos y servicios con IVA</Text>
            <View row spread marginT-10>
              <Text>{service?.name}</Text>
              <Text>${service?.price}</Text>
            </View>
            <View row spread marginT-10>
              <Text>Impuesto IVA 16%</Text>
              <Text>
                ${(service?.price * parseInt(service?.tax_percent)) / 100}
              </Text>
            </View>
            <View row spread marginT-10>
              <Text>Tarifa de servicio</Text>
              <Text>$10</Text>
            </View>
            <View row spread marginT-10>
              <Text text70BO>Total a pagar</Text>
              <Text text70BO>
                $
                {parseFloat(service.price) +
                  (service?.price * parseInt(service?.tax_percent)) / 100 +
                  10}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={openBottomSheet}>
            <Text text70BO color={Colors.primaryColor}>
              Confirmar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["100%"]}
        onChange={handleSheetChanges}
        style={{
          borderWidth: 1.5,
          borderRadius: 16,
          borderColor: Colors.black,
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <PaymentScreen amount={150} closeBottomSheet={closeBottomSheet} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default Resume;

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
  servicesContainer: {
    marginTop: "5%",
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
    width: "95%",
    height: 60,
    borderWidth: 0.5,
    borderColor: Colors.primaryColor,
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
