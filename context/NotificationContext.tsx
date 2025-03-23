import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Context = createContext({
    notifications: [],
    markNotificationAsRead: (notificationId: string) => { }
} as {
    notifications: (Notifications.Notification & { readed: boolean })[]
    markNotificationAsRead: (notificationId: string) => void
})

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const registerForPushNotifications = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        Alert.alert('Permission not granted to get push token for push notification!')
        return;
    }
    const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
        Alert.alert('Project ID not found');
    }
    try {
        const pushTokenString = (
            await Notifications.getExpoPushTokenAsync({
                projectId,
            })
        ).data;
        console.log(pushTokenString);
        return pushTokenString;
    } catch (e: unknown) {
        Alert.alert(`${e}`);
    }
}

export default function NotificationContext({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<(Notifications.Notification & { readed: boolean })[]>([])
    const notificationListener = useRef<Notifications.Subscription>();

    const markNotificationAsRead = async (notificationId: string) => {
        const tempNotifications = notifications.map(n => n.request.identifier === notificationId ? { ...n, readed: true } : n)
        setNotifications(tempNotifications)
        await AsyncStorage.setItem("notifications", JSON.stringify(tempNotifications))
    }

    useEffect(() => {
        const loadStoredNotifications = async () => {
            let notificationsString = await AsyncStorage.getItem("notifications")
            let notificationsParsed = notificationsString ? JSON.parse(notificationsString) : []
            setNotifications(notificationsParsed)
        }
        loadStoredNotifications()
    }, [])


    useEffect(() => {
        registerForPushNotifications()
            .then(token => console.log("ExpoToken", token))
            .catch((error: any) => console.log("Error", error));

        notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
            let notificationsString = await AsyncStorage.getItem("notifications")
            let notificationsStored = notificationsString ? JSON.parse(notificationsString) : []

            const notifications = [...notificationsStored, { ...notification, readed: false }]
            await AsyncStorage.setItem("notifications", JSON.stringify(notifications))
            setNotifications(notifications)
        });

        return () => {
            notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current)
        }
    }, [])

    return (
        <Context.Provider value={{ notifications: notifications, markNotificationAsRead: markNotificationAsRead }}>
            {children}
        </Context.Provider>
    )
}

export const useNotificationsContext = () => {
    const context = useContext(Context)
    return context
}