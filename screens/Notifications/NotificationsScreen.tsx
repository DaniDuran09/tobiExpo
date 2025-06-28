import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Modal, Image, TouchableOpacity} from "react-native-ui-lib";
import { useNotificationsContext } from "../../context/NotificationContext";
import { Colors } from "../../styles/Colors";
import { FlatList, Touchable } from "react-native";
import RenderNotification from "../../components/renders/RenderNotification";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import ApiFetcher from "../../modules/ApiFetcher";
import * as Notifications from 'expo-notifications';

interface Notification {
  id: number;
  title: string;
  created_at: string;
  status: string;
  picture:string;
  body:string;
}

type NotificationsStackParamList = {
  NotificationsHome: undefined;
  NotificationDetail: {
    id: number;
    title: string;
    body: string;
    image:string;
  };
};

type NotificationsScreenNavigationProp = StackNavigationProp<NotificationsStackParamList>;

export default function NotificationsScreen() {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();
  // const { notifications, markNotificationAsRead, clearNotifications } = useNotificationsContext();
  // const notificationsSorted = [...notifications].sort((a, b) => b.date - a.date)
  const apiFetcher = new ApiFetcher();
  

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getNotificationsHistory();
  }, []);

  const getNotificationsHistory = async () => {
    try {
      const response = await apiFetcher.getNotifications();
      const notifications = response.data;
      console.log("NOTIFICACIONES",notifications);
      setNotifications(notifications);
      
    } catch (error) {
      console.log('Error al obtener notificaciones:', error);
    }
  };
  
  
/*const getPushToken = async () => {
const token = (await Notifications.getDevicePushTokenAsync()).data;
console.log("Token FCM/APNs", token);
};
useEffect(() => {
  getPushToken(); 
}, []);*/

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <View row centerV spread paddingT-20 paddingH-20 marginB-20>
        <Text text50BO>Notificaciones</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <RenderNotification
            content={item.title}
            date={item.created_at}
            image={item.picture}
            onPress={() => {
              // markNotificationAsRead(item.request.identifier)
              navigation.navigate("NotificationDetail", {
                id: item.id,
                title: item.title,
                body: item.body,
                image:item.picture,

              })
            }}
            readed={item.status === "read"}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
     
    </SafeAreaView>
  );
}

