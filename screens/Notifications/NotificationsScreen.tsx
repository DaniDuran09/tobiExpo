import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import { FlatList } from "react-native";
import RenderNotification from "../../components/renders/RenderNotification";
import { useNavigation } from "@react-navigation/native";
import { useGetNotificationsQuery } from "../../services/api/notifications.api";
export default function NotificationsScreen() {
  const navigation = useNavigation<any>()

  const { data: notificationsResponse, refetch: refetchNotifications } = useGetNotificationsQuery();
  const notifications = notificationsResponse?.data || []
  
  const notificationsSorted =  [...notifications].sort((a, b) => {
    const createdAt = new Date(a.created_at)
    const createdAtB = new Date(b.created_at)
    return createdAtB.getTime() - createdAt.getTime()
  })

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <View row centerV spread paddingT-20 paddingH-20 marginB-20>
        <Text text50BO>Notificaciones</Text>
      </View>
      <FlatList
        data={notificationsSorted}
        renderItem={({ item }) => (
          <RenderNotification
            content={item.title}
            date={item.created_at}
            onPress={() => {
              navigation.push("NotificationDetail", {
                id: item.id,
                title: item.title,
                body: item.title
              })
            }}
            readed={item.status !== "pending"}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
    </SafeAreaView>
  );
}
