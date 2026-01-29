import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";
import ApiFetcher from "../../../modules/ApiFetcher";
import { useNavigation, useRoute } from "@react-navigation/native";

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

const ResumeByPet = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const apiFetcher = new ApiFetcher();
  const [data, setData] = useState<any>();

  const confirmCart = async () => {
  try {
    const res = await apiFetcher.confirmCart(route.params.cart);

    navigation.navigate('PaymentScreen', {
      url: res.data.session.url,
      cartId: route.params.cart,
    });

  } catch (error) {
    console.log('error al confirmar el carro', error);
  }
};


  useEffect(() => {
    if (!route?.params?.cart) return;

    const getCart = async () => {
      try {
        const res = await apiFetcher.getCart(route.params.cart);
        setData(res);
      } catch (error) {
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

  const generalStart = formatDateTimeMX(data.data.datetime_start);
  const generalEnd = formatDateTimeMX(data.data.datetime_end);

  return (
    <ScrollView style={{ padding: 20, backgroundColor: "white", paddingBottom: 50 }}>
      <View bg-white paddingB-30>
        <Text
          text70BL
          style={{ color: data.data.status === "active" ? "green" : "red" }}
        >
          {data.data.status === "active" ? "Activo" : "Expirado"}
        </Text>

        <Text text60>{data.data.partner.display_name}</Text>

        <View row spread marginV-20>
          <Text text60BL>Servicios: {data.data.items_count}</Text>
          <Text text60BL>Total: ${data.data.price_total}</Text>
        </View>

        <Text>{generalStart.date}</Text>
        <Text>
          {generalStart.time} - {generalEnd.time} (GMT-6)
        </Text>

        {data.data.items.map((item: any) => {
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
              <View row spread>
                <Text text60>{item.service.name}</Text>
                <Text text60>Total: ${item.price_total}</Text>
              </View>

              <Text>{item.pet.display_name}</Text>
              <Text>Duración: {item.duration_minutes} min</Text>

              <Text>{itemStart.date}</Text>
              <Text>
                {itemStart.time} - {itemEnd.time} (GMT-6)
              </Text>

              <Text>Subtotal: ${item.price_subtotal}</Text>
              <Text>Impuesto: ${item.tax_amount}</Text>

              <View width={"100%"} bg-black height={0.5} />

              <Text text70L>Veterinario</Text>
            </View>
          );
        })}
      </View>
      <TouchableOpacity
        bg-red30
        br100
        center
        style={{ height: 50, marginBottom: 50 }}
        onPress={() => { confirmCart() }}
      >
        <Text white text60L>Continuar y pagar</Text>
      </TouchableOpacity>
    </ScrollView >
  );
};

export default ResumeByPet;
