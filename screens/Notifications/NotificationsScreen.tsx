import { SafeAreaView } from "react-native-safe-area-context"
import { View, Text } from "react-native-ui-lib"
import { useNotificationsContext } from "../../context/NotificationContext"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { Colors } from "../../styles/Colors"
import { SectionList } from "react-native"
import RenderNotification from "../../components/renders/RenderNotification"
import { NotificationIcon } from "../../components/notifications"

export default function NotificationsScreen() {
    const { notifications, markNotificationAsRead } = useNotificationsContext()

    const notificationsReaded = notifications.filter(n => n.readed)
    const newNotifications = notifications.filter(n => !n.readed)

    const sections = [
        {
            title: "Nuevas",
            data: newNotifications
        },
        {
            title: "Visto",
            data: notificationsReaded
        }
    ]

    return (
        <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
            <View row centerV spread paddingT-20 paddingH-20 >
                <Text text50BO>Notificaciones</Text>
                <NotificationIcon badget={notifications.some(n => !n.readed)} />
            </View>
            <SectionList
                sections={sections}
                renderSectionHeader={({ section: { title, data } }) => (
                    <Text text70BO margin-20>{title} ({data.length})</Text>
                )}

                ItemSeparatorComponent={() => <View height={5} />}
                renderItem={({ item, section }) =>
                    <RenderNotification
                        content={item.request.content.body}
                        date={item.date}
                        title={section.title}
                        onPress={() => {
                            markNotificationAsRead(item.request.identifier)
                        }}
                    />
                }
            />

        </SafeAreaView>
    )
}