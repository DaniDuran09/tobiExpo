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
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

interface Notification {
  id: number;
  title: string;
  created_at: string;
  status: string;
}

type NotificationsStackParamList = {
  NotificationsHome: undefined;
  NotificationDetail: {
    id: number;
    title: string;
    body: string;
  };
};

type NotificationsScreenNavigationProp = StackNavigationProp<NotificationsStackParamList>;

export default function NotificationsScreen() {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();
  // const { notifications, markNotificationAsRead, clearNotifications } = useNotificationsContext();
  // const notificationsSorted = [...notifications].sort((a, b) => b.date - a.date)
  const [modalVisible , setModalVisible] = useState(true)
  const apiFetcher = new ApiFetcher();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getNotificationsHistory();
  }, []);

  const getNotificationsHistory = async () => {
    try {
      const response = await apiFetcher.getNotifications();
      setNotifications(response.data);
      console.log("response", response.data[0]);
    } catch (error) {
      console.log(error);
    }
  }
  
const getPushToken = async () => {
const token = (await Notifications.getDevicePushTokenAsync()).data;
console.log("Token FCM/APNs", token);
};
useEffect(() => {
  getPushToken(); 
  //ExponentPushToken[31R33WKcHcTqbYygIfwQ9J]
  //
}, []);

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
            onPress={() => {
              // markNotificationAsRead(item.request.identifier)
              navigation.navigate("NotificationDetail", {
                id: item.id,
                title: item.title,
                body: item.title
              })
            }}
            readed={item.status === "read"}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
      <Modal 
      visible={modalVisible} 
      >
        <View style={{backgroundColor:Colors.primaryColor,width:'100%',height:50,paddingHorizontal:10,paddingTop:10}}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={{width:50,height:50}}>
            <Icon name="chevron-left" size={45} color="black" />
          </TouchableOpacity>
        </View>
        <View flex centerH style={{backgroundColor: Colors.primaryColor
        }}>
          
          <Image
            source={require("../../assets/images/Component-noti-1.png")}
            style={{ width: 100, height: 100, marginBottom: 20 }}
          />
          <Text black text40BO>Te ayudo a que no se te pase</Text>
          <Text black text40BO>Lo que si importa 🐾</Text>
          <View height={40} />
          <Text black text50>Sabemos que los días pasan volando...</Text>
          <Text black text50BO>¿Quieres que te avise cuando toque su</Text>
          <Text black text50BO>vacuna, desparasitación o cita con el vet?</Text>
          <Text black text50BO marginB-30>TOBI está aquí para cuidar contigo 💚</Text>
          <Image
            source={require("../../assets/phone-notification.png")}
            style={{  marginVertical:40,width: 300, height: 180, marginTop: 20 }}
          />
          <TouchableOpacity style={{backgroundColor: 'black', padding: 10, borderRadius: 40, marginTop: 20 , width:'80%',height:70}} center>  
            <Text text50BL color={Colors.primaryColor}>Permitir recordatorios</Text>  
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 10,  width:'80%',height:70}} center>  
            <Text text50BL white>Tal vez después</Text>  
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

