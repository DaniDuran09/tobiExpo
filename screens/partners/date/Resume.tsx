import { FlatList } from "react-native";
import { useSelector } from "react-redux";
import React, { useCallback, useRef, useState } from "react";
import { Colors } from "../../../styles/Colors";
import calendar from "../../../assets/calendar-icon-date.png";
import location from "../../../assets/location-icon.png";
import phoneImage from "../../../assets/phone-icon.png";
import { ScrollView } from "react-native-gesture-handler";
import PaymentScreen from "../../../components/appointments/PaymentScreen";
import {
  AnimatedImage,
  LoaderScreen,
  Text,
  View,
  Image,
  TouchableOpacity
} from "react-native-ui-lib";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import ApiFetcher from "../../../modules/ApiFetcher";
import Loading from "../../../components/Loading";
import Toast from "react-native-toast-message";
import ResumeSectionContainer from "../../../components/appointments/ResumeSectionContainer";

const Resume = ({ route }) => {
  const { payload, phone } = route.params;
  const appointment = useSelector((state) => state?.appointment?.appointment);
  const [loading, setLoading] = useState(false);
  const bottomSheetRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");

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

  const totalPrice = appointment?.service.reduce((sum, item) => {
    const priceToPay = parseFloat(item.price_total)

    return sum + priceToPay

  }, 0);

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
          <TouchableOpacity>
            <Image
              source={require("../../../assets/edit-date.png")}
              width={15}
              height={15}
            />
          </TouchableOpacity>
        </View>
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
        </View>
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
            <Image source={phoneImage} width={25} height={25} resizeMode="cover" />
            <Text text70>{phone}</Text>
          </ResumeSectionContainer>

        </View>
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
