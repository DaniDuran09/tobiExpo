import { FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import React, { useCallback, useRef, useState } from "react";
import { Colors } from "../../../styles/Colors";
import calendar from "../../../assets/calendar-icon-date.png";
import location from "../../../assets/location-icon.png";
import phoneImage from "../../../assets/phone-icon.png";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import Entypo from "react-native-vector-icons/Entypo";
import PaymentScreen from "../../../components/appointments/PaymentScreen";
import {
  AnimatedImage,
  ExpandableSection,
  LoaderScreen,
  Text,
  View,
} from "react-native-ui-lib";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import momentTZ from "../../../utils/moment";
import AppStorage from "../../../modules/AppStorage";
import ApiFetcher from "../../../modules/ApiFetcher";
import Loading from "../../../components/Loading";
import Toast from "react-native-toast-message";

const Resume = ({ route }) => {
  const { payload, phone } = route.params;
  const appointment = useSelector((state) => state?.appointment?.appointment);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");

  const appStorage = new AppStorage();
  const apiFetcher = new ApiFetcher();

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const goToPay = async () => {
    setLoading(true);
    try {
      const response = await apiFetcher.registerAppointments(payload);
      console.log("response: ", response);
      if (response.code == 200) {
        setCheckoutUrl(response.data.payment.checkout_url);
        openBottomSheet();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "No se pudo agendar la cita",
        text2: `Intenta de nuevo más tarde`,
      });
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
    setExpanded(true);
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    setExpanded(false);
  };

  const formatDateTime = (date, time) => {
    const combinedDateTime = momentTZ(date).set({
      hour: momentTZ(time).hour(),
      minute: momentTZ(time).minute(),
    });
    const formattedDateTime = combinedDateTime.format(
      "dddd D [de] MMMM, h:mm [hrs]"
    );
    return (
      formattedDateTime.charAt(0).toUpperCase() + formattedDateTime.slice(1)
    );
  };

  const totalPrice =
    appointment?.service.reduce((sum, item) => {
      const priceToPay = parseFloat(item.price);

      return sum + priceToPay;
    }, 0);

    console.log("appointment: ", appointment)

  return (
    <View flex backgroundColor={Colors.white}>
      {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      <ScrollView style={expanded && { opacity: 0.1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Resumen de la cita</Text>
          <TouchableOpacity
          // onPress={() => navigation.navigate("InfoServiceForDate")}
          >
            <Image
              source={require("../../../assets/edit-date.png")}
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>
        {/* <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={(item, index) => index.toString()}
        /> */}
        {/* <ExpandableSection
        expanded={expandedAppointment === item}
        sectionHeader={ */}
        <View
          row
          centerV
          marginT-15
          padding-15
          spread
          style={{
            shadowColor: Colors.gray,
            shadowOffset: { width: 0, height: 3 },
            // shadowOpacity: expandedAppointment !== item && 0.5,
            shadowRadius: 2,
            marginBottom: 10,
            backgroundColor: Colors.white,
          }}
        >
          <View row centerV gap-10>
            <AnimatedImage
              source={{ uri: appointment?.pet?.picture }}
              style={{ width: 70, height: 70, borderRadius: 64 }}
              loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
              animationDuration={500}
              resizeMode="cover"
            />
            <View>
              <Text text70BO>{appointment?.pet?.name}</Text>
              <Text text70>{appointment?.pet?.pet_breed?.description}</Text>
            </View>
          </View>
        </View>
        <View style={styles.servicesContainer} margin-15>
          <View style={styles.section}>
            <Text text70BO>Servicios</Text>
            <View style={styles.rowSection}>
              <View>



                {appointment?.service.map(({ name }) => (
                  <View row gap-5 centerV>
                    <Text text100>{`\u25CF`}</Text>
                    <Text style={styles.description}>{name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text text70BO>Día y hora</Text>
            <View style={styles.rowSection}>
              <Image
                source={calendar}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.description}>{appointment?.time}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text text70BO>Importe</Text>
            <View style={styles.rowSection}>
              <Text text70BO color={Colors.primaryColor}>
                $
              </Text>
              <Text style={styles.description}>{totalPrice}</Text>
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
              <Text style={styles.description}>
                {appointment?.partenerLocation}
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text text70BO>Teléfono</Text>
            <View style={styles.rowSection}>
              <Image source={phoneImage} style={styles.image} resizeMode="cover" />
              <Text style={styles.description}>{phone}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity></TouchableOpacity>
        <View flex padding-15>
          <Text marginT-20 style={styles.title}>
            Resumen
          </Text>
          <View style={styles.servicesContainer}>
            <Text text70BO>Productos y servicios</Text>
            <FlatList
              row
              spread
              marginT-10
              data={appointment.service}
              renderItem={({ item }) => (
                <View row spread marginT-10>
                  <Text>{item.name}</Text>
                  <Text>${item.price_total}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
            <View row spread marginT-10></View>
            <View row spread marginT-10>
              <Text>Tarifa de servicio</Text>
              <Text>$10</Text>
            </View>
            <View row spread marginT-10>
              <Text text70BO>Total a pagar</Text>
              <Text text70BO>${totalPrice + 10}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View bottom marginB-15>
        <TouchableOpacity style={styles.saveButton} onPress={goToPay}>
          <Text text70BO color={Colors.primaryColor}>
            Confirmar
          </Text>
        </TouchableOpacity>
      </View>
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
          <PaymentScreen
            checkoutUrl={checkoutUrl}
            closeBottomSheet={closeBottomSheet}
          />
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
    padding: 15,
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
    marginBottom: 0,
  },
  contentContainer: {
    padding: 15,
  },
});
