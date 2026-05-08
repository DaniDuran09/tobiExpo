import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Modal, Image, TouchableOpacity } from "react-native-ui-lib";
import { useNotificationsContext } from "../../context/NotificationContext";
import { Colors } from "../../styles/Colors";
import { FlatList, Touchable } from "react-native";
import RenderNotification from "../../components/renders/RenderNotification";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import ApiFetcher from "../../modules/ApiFetcher";
import * as Notifications from 'expo-notifications';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface Notification {
  id: number;
  title: string;
  created_at: string;
  status: string;
  picture: string;
  body: string;
  category: string;
  metadata: any;
  pet_id?: number;
}

type NotificationsStackParamList = {
  NotificationsHome: undefined;
  NotificationDetail: {
    id: number;
    title: string;
    body: string;
    image: string;
  };
};

type NotificationsScreenNavigationProp = StackNavigationProp<NotificationsStackParamList>;

export default function NotificationsScreen() {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();
  const apiFetcher = new ApiFetcher();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getNotificationsHistory();
  }, []);

  const getNotificationsHistory = async () => {
    setLoading(true);
    try {
      const response = await apiFetcher.getNotifications();
      const notifications = response.data;
      setNotifications(notifications || []);
    } catch (error) {
      console.log('Error al obtener notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <View row centerV spread paddingV-10 paddingH-20 style={{ borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} row centerV>
          <Icon name="chevron-left" size={30} color={Colors.black} />
          <Text text60BO marginL-10>Notificaciones</Text>
        </TouchableOpacity>
        <View />
      </View>

      <FlatList
        data={notifications}
        refreshing={loading}
        onRefresh={getNotificationsHistory}
        renderItem={({ item }) => (
          <RenderNotification
            id={item.id}
            content={item.title}
            date={item.created_at}
            image={item.picture}
            body={item.body}
            onPress={() => {
              console.log('Notification details:', item);
              const metadata = item.metadata || {};
              const body = item.body || "";

              let q = metadata.q || metadata.service_name || metadata.vaccine_name || metadata.deworming_type;
              const type = metadata.type;

              if (!q) {
                if (type === "weight") {
                  q = "Consulta General";
                } else if (type === "deworming") {
                  q = "Desparasitación";
                } else if (type === "vaccine") {
                  const match = body.match(/vacuna de ([^ ,.]+)/i);
                  q = match ? match[1] : "Vacuna";
                }
              }

              const serviceId = metadata.service_id || metadata.vaccine_id || 15;
              const petId = item.pet_id || metadata.pet_id;

              const isServiceNotification = item.category === "URGENTE" ||
                item.category === "POR VENCER" ||
                q ||
                metadata.vaccine_id ||
                metadata.service_id ||
                type;

              if (isServiceNotification) {
                (navigation as any).navigate("Explore", {
                  screen: "SelectService",
                  params: {
                    serviceId: serviceId,
                    petId: petId,
                    q: q
                  }
                });
              }
            }}
            category={item.category}
            readed={item.status === "read"}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <View flex center marginT-100>
            <Icon name="bell-off-outline" size={60} color="#E0E0E0" />
            <Text text70 gray marginT-20>No hay notificaciones</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

