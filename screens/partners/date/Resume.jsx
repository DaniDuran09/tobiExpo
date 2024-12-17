import { FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import React, { useCallback, useRef, useState } from "react";
import { Colors } from "../../../styles/Colors";
import calendar from "../../../assets/calendar-icon-date.png";
import location from "../../../assets/location-icon.png";
import phone from "../../../assets/phone-icon.png";
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
  Image,
  TouchableOpacity
} from "react-native-ui-lib";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import momentTZ from "../../../utils/moment";
import AppStorage from "../../../modules/AppStorage";
import ApiFetcher from "../../../modules/ApiFetcher";
import Loading from "../../../components/Loading";
import Toast from "react-native-toast-message";
import ResumeSectionContainer from "../../../components/appointments/ResumeSectionContainer";

const Resume = ({ route }) => {
  const { payload } = route.params;
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
      const response = await apiFetcher.registerAppointments(payload)
      console.log("response: ", response)
      if (response.code == 200) {
        setCheckoutUrl(response.data.payment.checkout_url)
        openBottomSheet()
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'No se pudo agendar la cita',
        text2: `Intenta de nuevo más tarde`,
      });
      console.log("Error: ", error)
    } finally {
      setLoading(false)
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

  //console.log("appointment?.service_: ", appointment?.service)
  const totalPrice = appointment?.service.reduce((sum, item) => {
    /*const priceWithTax =
      parseFloat(item.price) +
      (parseFloat(item.price) * parseInt(item.tax_percent)) / 100;
    return sum + priceWithTax + 10; // Añadir 10 a cada precio calculado*/
    const priceToPay = parseFloat(item.price)

    return sum + priceToPay

  }, 0) + 10;

  return (
    <View flex backgroundColor={Colors.white}>
      {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      <ScrollView style={expanded && { opacity: 0.1 }}>
        <View row centerV padding-15 gap-10>
          <Text text65BO >Resumen de la cita</Text>
          <TouchableOpacity
          // onPress={() => navigation.navigate("InfoServiceForDate")}
          >
            <Image
              source={require("../../../assets/edit-date.png")}
              width={15}
              height={15}
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
          marginB-10
          backgroundColor={Colors.white}
          style={{
            shadowColor: Colors.gray,
            shadowOffset: { width: 0, height: 3 },
            // shadowOpacity: expandedAppointment !== item && 0.5,
            shadowRadius: 2,
          }}
        >
          <View row centerV gap-10>
            <AnimatedImage
              source={{ uri: appointment?.pet?.picture }}
              width={70}
              height={70}
              style={{ borderRadius: 64 }}
              loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
              animationDuration={500}
              resizeMode="cover"
            />
            <View>
              <Text text70BO>{appointment?.pet?.name}</Text>
              <Text text70>{appointment?.pet?.pet_breed?.description}</Text>
            </View>
          </View>
          {/* <Entypo
              name={
                expandedAppointment === item ? "chevron-up" : "chevron-down"
              }
              size={25}
              color={Colors.gray}
            /> */}
        </View>
        {/* }
        onPress={() =>
          setExpandedAppointment(expandedAppointment === item ? null : item)
        }
      > */}
        <View margin-15 padding-15 style={{ borderRadius: 16, borderColor: Colors.blue, borderWidth: 1.5 }}>
          <ResumeSectionContainer title="Servicios">
            {appointment?.service.map(({ name }) => (
              <View row gap-5 centerV>
                <Text text100>{`\u25CF`}</Text>
                <Text text70>{name}</Text>
              </View>
            ))}
          </ResumeSectionContainer>

          <ResumeSectionContainer title="Día y hora">
            <Image
              source={calendar}
              width={25}
              height={25}
              resizeMode="contain"
            />
            <Text text70>{appointment?.time}</Text>
          </ResumeSectionContainer>

          <ResumeSectionContainer title="Importe">
            <Text text70BO color={Colors.primaryColor}>
              $
            </Text>
            <Text text70>{totalPrice}</Text>
          </ResumeSectionContainer>

          <ResumeSectionContainer title="Dirección">
            <Image
              source={location}
              width={20}
              height={20}
              resizeMode="contain"
            />
            <Text text70>{appointment?.partenerLocation}</Text>
          </ResumeSectionContainer>

          <ResumeSectionContainer title="Teléfono">
            <Image source={phone} width={25} height={25} resizeMode="cover" />
            <Text text70>55 555 5555</Text>
          </ResumeSectionContainer>

        </View>
        {/* </ExpandableSection> */}
        <TouchableOpacity
        // onPress={() => {
        //   resetParams();
        //   navigation.navigate("InfoServiceForDate");
        // }}
        >
          {/* <Text style={styles.title} marginL-5> */}

          {/* </Text> */}
        </TouchableOpacity>
        <View flex padding-15>
          <Text marginT-20 text65BO>
            Resumen
          </Text>
          <View padding-15 style={{ borderRadius: 16, borderColor: Colors.blue, borderWidth: 1.5 }}>
            <Text text70BO>Productos y servicios</Text>
            <FlatList
              row spread marginT-10
              data={appointment.service}
              renderItem={({ item }) => (
                <View row spread marginT-10>
                  <Text>{item.name}</Text>
                  <Text>${item.price_total}</Text>
                </View>
              )}
              keyExtractor={item => item.id.toString()}
            />
            {/* <Text>{appointments[0]?.service?.name}</Text>*/}

            {/* <View row spread marginT-10>
              <Text>Impuesto IVA %</Text>
              <Text>
                $
                {totalPay}
              </Text>
            </View> */}
            <View row spread marginT-10>
            </View>
            <View row spread marginT-10>
              <Text>Tarifa de servicio</Text>
              <Text>$10</Text>
            </View>
            <View row spread marginT-10>
              <Text text70BO>Total a pagar</Text>
              <Text text70BO>${totalPrice}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View bottom marginB-15>
        <TouchableOpacity marginT-30 marginB-0 center
          style={{
            width: "95%",
            height: 60,
            borderWidth: 0.5,
            borderColor: Colors.primaryColor,
            alignSelf: "center",
          }}
          onPress={goToPay}>
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
        <BottomSheetView style={{padding:15}}>
          <PaymentScreen checkoutUrl={checkoutUrl} closeBottomSheet={closeBottomSheet} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default Resume;
