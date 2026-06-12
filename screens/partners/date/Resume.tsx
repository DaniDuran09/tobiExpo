import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";
import ApiFetcher from "../../../modules/ApiFetcher";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const formatDateTimeMX = (isoDate: string) => {
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

const Resume = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const apiFetcher = new ApiFetcher();
  const [data, setData] = useState<any>();
  const [isConfirming, setIsConfirming] = useState(false);

  const confirmCart = async () => {
    if (isConfirming) return;
    setIsConfirming(true);
    try {
      const res = await apiFetcher.confirmCart(route.params.cart);

      navigation.navigate('PaymentScreen', {
        url: res.data.session.url,
        cartId: route.params.cart,
      });

    } catch (error) {
      console.log('error al confirmar el carro', error);
      Toast.show({
        type: "error",
        text1: "Hubo un error al confirmar tu carrito",
        text2: `Inténtalo de nuevo más tarde`,
      });
    } finally {
      setIsConfirming(false);
    }
  };


  useEffect(() => {
    if (!route?.params?.cart) return;

    const getCart = async () => {
      try {
        const res = await apiFetcher.getCart(route.params.cart);
        setData(res);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Hubo un error al traer tu carrito",
          text2: `Inténtalo de nuevo más tarde`,
        });
        console.log("Error fetching cart:", error);
      }
    };

    getCart();
  }, [route?.params?.cart]);

  if (!data?.data) {
    return (
      <View flex style={{ backgroundColor: "#D0F9FF" }} width={"100%"} height={"100%"} center>
        <Text>Cargando carrito...</Text>
      </View>
    );
  }


  // Calcular subtotal (suma de price_subtotal de cada ítem)
  const subtotal = data.data.items.reduce(
    (acc: number, item: any) => acc + parseFloat(item.price_subtotal || 0),
    0
  );
  // Tarifa de servicio = total - subtotal
  const serviceFee = parseFloat(data.data.price_total) - subtotal;

  return (
    <ScrollView style={{ backgroundColor: "white" }} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
      <View bg-white>
        {/* Encabezado partner */}
        <Text text60BL>{data.data.partner.name}</Text>
        <Text text90 color="#888" marginT-2>{data.data.partner.address}</Text>

        {/* Contador de servicios */}
        <View row spread centerV marginV-16 paddingV-12
          style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#EAEAEA" }}
        >
          <Text text70BL>{data.data.items_count} {data.data.items_count === 1 ? "servicio" : "servicios"}</Text>
          <Text text70BL>${parseFloat(data.data.price_total).toFixed(2)}</Text>
        </View>

        {/* Cards de servicios */}
        {data.data.items.map((item: any) => {
          const itemStart = formatDateTimeMX(item.datetime_range.start);
          const itemEnd = formatDateTimeMX(item.datetime_range.end);

          return (
            <View
              key={item.id}
              style={{
                marginBottom: 12,
                padding: 14,
                borderWidth: 1,
                borderColor: "#DADADA",
                borderRadius: 10,
              }}
            >
              {/* Nombre + precio */}
              <View row spread centerV marginB-4>
                <Text text70BL style={{ flex: 1, paddingRight: 8 }}>
                  {item.service.name}
                </Text>
                <Text text70BL>${parseFloat(item.price_total).toFixed(2)}</Text>
              </View>

              {/* Mascota */}
              {item.pet?.display_name && (
                <Text text70BL marginB-8>
                  {item.pet.display_name}
                </Text>
              )}

              {/* Fecha */}
              <View row centerV marginB-4>
                <Text text80 style={{ marginRight: 6 }}>📅</Text>
                <Text text80>{itemStart.date.charAt(0).toUpperCase() + itemStart.date.slice(1)}.</Text>
              </View>

              {/* Hora */}
              <View row centerV marginB-10>
                <Text text80 style={{ marginRight: 6 }}>🕐</Text>
                <Text text80>{itemStart.time} - {itemEnd.time} (GMT-6)</Text>
              </View>

              {/* Divisor */}
              <View height={0.5} style={{ backgroundColor: "#DADADA" }} marginB-8 />

              {/* Categoría */}
              <Text text80 color="#888">
                {item.service?.service_category?.name || "Servicio"}
              </Text>
            </View>
          );
        })}
        {/* Sección de totales */}
        <View marginT-8 style={{ borderTopWidth: 1, borderColor: "#EAEAEA", paddingTop: 16 }}>
          <View row spread marginB-8>
            <Text text70>Subtotal servicios</Text>
            <Text text70>${subtotal.toFixed(2)}</Text>
          </View>

          <View row spread marginB-12>
            <Text text70>Tarifa de servicio</Text>
            <Text text70>${serviceFee.toFixed(2)}</Text>
          </View>

          <View row spread>
            <Text text70BL>Total a pagar</Text>
            <Text text70BL>${parseFloat(data.data.price_total).toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Botón de pago */}
      <TouchableOpacity
        bg-red30
        br100
        center
        disabled={isConfirming}
        style={{ height: 50, marginTop: 24, marginBottom: 30 }}
        onPress={() => { confirmCart() }}
      >
        <Text white text60L>Continuar y pagar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Resume;
