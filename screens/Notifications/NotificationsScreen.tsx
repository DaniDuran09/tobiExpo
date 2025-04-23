import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native-ui-lib";
import { useNotificationsContext } from "../../context/NotificationContext";
import { Colors } from "../../styles/Colors";
import { FlatList } from "react-native";
import RenderNotification from "../../components/renders/RenderNotification";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
export default function NotificationsScreen() {
  const navigation = useNavigation<any>()
  const { notifications, markNotificationAsRead, clearNotifications } = useNotificationsContext();
  const notificationsSorted = [...notifications].sort((a, b) => b.date - a.date)

  // useEffect(() => {
  //   clearNotifications()
  // }, [])

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <View row centerV spread paddingT-20 paddingH-20 marginB-20>
        <Text text50BO>Notificaciones</Text>
      </View>
      <FlatList
        data={notificationsSorted}
        renderItem={({ item }) => (
          <RenderNotification
            content={item.request.content.body}
            date={item.date}
            onPress={() => {
              markNotificationAsRead(item.request.identifier)
              navigation.push("NotificationDetail", {
                id: item.request.identifier,
                title: item.request.content.title,
                body: item.request.content.body
              })
            }}
            readed={item.readed}
          />
        )}
        keyExtractor={item => item.request.identifier}
      />
    </SafeAreaView>
  );
}
