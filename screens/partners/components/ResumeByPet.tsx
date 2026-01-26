import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { View, Text } from "react-native-ui-lib";
import ApiFetcher from "../../../modules/ApiFetcher";

interface CartItem {
  id: number;
  service?: {
    name: string;
    price_total?: string | number;
  };
  product?: {
    name: string;
    price?: string | number;
  };
  pet?: {
    id: number;
    name: string;
  };
  datetime_range?: {
    start: string;
    end: string;
  };
  price_total?: string | number;
}

const ResumeByPet = ({ route }: any) => {
  const [itemsByPet, setItemsByPet] = useState<Record<string, CartItem[]>>({});
  const apiFetcher = new ApiFetcher();

  useEffect(() => {
    if (!route?.params?.cart) return;

    const getCart = async () => {
      try {
        const res = await apiFetcher.getCart(route.params.cart);
        console.log("Cart response:", res);

        // Ajusta esta línea según tu ApiFetcher
        const items: CartItem[] = res.data?.items || []; // <-- seguro que apunta a los items

        // Agrupamos por mascota
        const grouped: Record<string, CartItem[]> = {};
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

  return (
    <ScrollView style={{ padding: 20 }}>
      {Object.keys(itemsByPet).length === 0 && (
        <Text>No hay productos o servicios en el carrito</Text>
      )}

      {Object.entries(itemsByPet).map(([petName, items]) => (
        <View key={petName} marginB-20>
          <Text text60 marginB-10>{petName}</Text>

          {items.map((item, i) => {
            const serviceName = item.service?.name || item.product?.name || "Sin nombre";
            const price = item.price_total || item.service?.price_total || item.product?.price || "0";

            const start = item.datetime_range?.start ? new Date(item.datetime_range.start) : null;
            const end = item.datetime_range?.end ? new Date(item.datetime_range.end) : null;

            const dateStr = start ? start.toLocaleDateString("es-MX") : "-";
            const timeStr = start && end ? `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "-";

            return (
              <View key={i} marginB-10 padding-10 style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8 }}>
                <Text text70>{serviceName}</Text>
                <Text text90 grey40>{dateStr} | {timeStr}</Text>
                <Text text80>${price}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

export default ResumeByPet;
