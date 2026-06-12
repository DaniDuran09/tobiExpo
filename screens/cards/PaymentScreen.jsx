import { useEffect, useState } from 'react';
import { Linking, ScrollView } from 'react-native';
import { View, Text, Button, Colors } from 'react-native-ui-lib';
import WebView from 'react-native-webview';
import ApiFetcher from '../../modules/ApiFetcher';
import Toast from 'react-native-toast-message';
import { Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const formatDateTimeMX = (isoDate) => {
  const date = new Date(isoDate);

  const dateFormatter = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Mexico_City",
  });

  const timeFormatter = new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Mexico_City",
  });

  return {
    date: dateFormatter.format(date),
    time: timeFormatter.format(date),
  };
};

const PaymentScreen = ({ route }) => {
  const { status, url, cartId } = route?.params || {};
  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [cartData, setCartData] = useState(null);

  useEffect(() => {
    if (status === 'success' && cartId) {
      fetchCart();
    }
  }, [status, cartId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await apiFetcher.getCart(cartId);
      console.log("RESCARTDATA", res.data.items)
      setCartData(res?.data);
      Toast.show({
        type: "success",
        text1: "Confirmación exitosa",
        text2: `Tu compra se realizó con exito`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al traer tu carrito",
        text2: `Inténtalo de nuevo más tarde`,
      });
      console.log('Error al obtener el carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    if (loading || !cartData) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Cargando confirmación...</Text>
        </View>
      );
    }

    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white', padding: 20, paddingTop: 50 }}>
        <View center style={{ marginBottom: 20, flexDirection: 'row' }}>
          <Icon source={'check-circle'} size={24} color={"#00b624ff"} />
          <Text text50 >Reserva confirmada</Text>
        </View>

        <Text text60BL>{cartData.partner?.name}</Text>

        <View style={{ marginVertical: 12 }}>
          <Text text70BL>Servicios: {cartData.items_count}</Text>
          <Text text70BL>Total: ${cartData.price_total}</Text>
        </View>

        {cartData.items?.map((item) => {
          const itemStart = formatDateTimeMX(item.datetime_range.start);
          const itemEnd = formatDateTimeMX(item.datetime_range.end);

          return (
            <View
              key={item.id}
              style={{
                marginTop: 16,
                padding: 12,
                borderWidth: 1,
                borderColor: "#8c8c8c",
                borderRadius: 8,
              }}
            >
              <View width={'100%'} row spread >
                <Text text70BL >{item.pet.display_name}</Text>
                <Text text70BL >${item.price_total}</Text>
              </View>

              <Text marginB-10 text70BL>{item.service.name}</Text>

              <View width={'100%'} row marginB-5>
                <Icon source={'calendar'} size={20} color={"black"} />
                <Text>{itemStart.date}</Text>
              </View>
              <View width={'100%'} row marginB-5>
                <Icon source={'clock'} size={20} color={"black"} />
                <Text>
                  {itemStart.time} - {itemEnd.time} (GMT-6)
                </Text>
              </View>
              {/* {<Text>Subtotal: ${item.price_subtotal}</Text>
              <Text>Impuesto: ${item.tax_amount}</Text>} */}
            </View>
          );
        })}
        <View style={{ width: '100%' }} center marginV-20>
          <Text text70BL center>Tu cita ha sido generada. {cartData.partner?.name} ha sido notificado, pronto recibirás una confirmación.</Text>
        </View>
        <View>
          <Button marginV-10 style={{ backgroundColor: "#EF3E36" }} onPress={() => navigation.navigate("ProfileStack", { screen: "AppointmentsHome" })}>
            <Text color='white' text60BL >Ver mis citas</Text>
          </Button>
          <Button marginV-10 style={{ backgroundColor: "#757575ff" }} onPress={() => navigation.navigate("SelectService")}>
            <Text color='white' text60BL >Volver a inicio</Text>
          </Button>
        </View>

      </ScrollView>
    );
  }

  if (!url) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No hay URL de pago</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        onShouldStartLoadWithRequest={(request) => {
          const reqUrl = request.url;
          console.log('REQURL ', reqUrl);

          if (reqUrl.startsWith('tobi://')) {
            console.log('Interceptado deep link:', reqUrl);
            Linking.openURL(reqUrl);
            return false;
          }

          return true;
        }}
      />
    </View>
  );
};

export default PaymentScreen;
