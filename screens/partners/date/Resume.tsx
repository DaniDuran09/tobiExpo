import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { View, Text } from "react-native-ui-lib";
import ApiFetcher from "../../../modules/ApiFetcher";

const ResumeByPet = ({ route }: any) => {
  const [itemsByPet, setItemsByPet] = useState<Record<string, any[]>>({});
  const apiFetcher = new ApiFetcher();

  useEffect(() => {
    if (!route?.params?.cart) return;

    const getCart = async () => {
      try {
        const res = await apiFetcher.getCart(route.params.cart);
        const items = res?.data?.data?.items || [];

        // Agrupar items por mascota
        const grouped: Record<string, any[]> = {};
        items.forEach(item => {
          const petName = item.pet?.name || "Sin mascota";
          if (!grouped[petName]) grouped[petName] = [];
          grouped[petName].push(item);
        });

        setItemsByPet(grouped);
      } catch (error) {
        console.log("Error fetching cart:", error);
      }
    };

    getCart();
  }, [route?.params?.cart]);

  // Formatear fecha y hora
  const formatDateTime = (datetime?: string) => {
    if (!datetime) return { day: "-", time: "-" };
    const d = new Date(datetime);
    return {
      day: d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "short" }),
      time: d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      {Object.keys(itemsByPet).length === 0 && (
        <Text>No hay productos o servicios en el carrito</Text>
      )}

      {Object.entries(itemsByPet).map(([petName, items]) => (
        <View key={petName} marginB-20>
          <Text text60H marginB-10>{`Mascota: ${petName}`}</Text>

          {items.map(item => {
            const start = formatDateTime(item.datetime_range?.start);
            const end = formatDateTime(item.datetime_range?.end);

            return (
              <View
                key={item.id || Math.random()}
                marginB-10
                padding-10
                style={{
                  borderWidth: 1,
                  borderColor: "#DDD",
                  borderRadius: 8,
                  backgroundColor: "#FAFAFA"
                }}
              >
                <Text text70>{item.service?.name || "Sin nombre"}</Text>
                <Text text90>{`Precio: $${item.price_total || "0"}`}</Text>
                <Text text90>{`Día: ${start.day}`}</Text>
                <Text text90>{`Hora: ${start.time} - ${end.time}`}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

export default ResumeByPet;
