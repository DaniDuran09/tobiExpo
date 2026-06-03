import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../hooks/navigationRef";

const Context = createContext({
    notifications: [],
    markNotificationAsRead: (notificationId: string) => { },
    registerForPushNotifications: () => { },
    clearNotifications: () => { }
} as {
    notifications: (Notifications.Notification & { readed: boolean })[]
    markNotificationAsRead: (notificationId: string) => void
    registerForPushNotifications: () => void
    clearNotifications: () => void
})

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function NotificationContext({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<(Notifications.Notification & { readed: boolean })[]>([])
    const notificationListener = useRef<Notifications.Subscription>();

    const clearNotifications = async () => {
        await AsyncStorage.removeItem("notifications")
        setNotifications([])
    }

    const registerForPushNotifications = async () => {

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            console.log("Project ID not found")
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log("token", pushTokenString);
        } catch (e: unknown) {
            Alert.alert(`${e}`);
        }
    }

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

        notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
            console.log("Notification Received:", notification);
            let notificationsString = await AsyncStorage.getItem("notifications")
            let notificationsStored = notificationsString ? JSON.parse(notificationsString) : []

            const notifications = [...notificationsStored, { ...notification, readed: false }]
            await AsyncStorage.setItem("notifications", JSON.stringify(notifications))
            setNotifications(notifications)
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            const metadata = data?.metadata || data;
            const body = response.notification.request.content.body || "";

            let q = data?.q || metadata?.service_name || metadata?.vaccine_name || metadata?.deworming_type;
            const type = metadata?.type;

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

            const serviceId = metadata?.service_id || metadata?.vaccine_id || null;
            const petId = data?.pet_id || metadata?.pet_id;

            if (q || metadata?.vaccine_id || metadata?.service_id || type) {
                navigate("Explore", {
                    screen: "SelectService",
                    params: {
                        serviceId: serviceId || null,
                        petId: petId || null,
                        q: q || null,
                        service_catalog_id: metadata?.service_catalog_id || null,
                        catalog_code: metadata?.service_catalog_code || metadata?.catalog_code || (type === "weight" ? "SC-CONSULTA-GENERAL" : null),
                        vaccine_id: metadata?.vaccine_id || null
                    }
                });
            }
        });

        return () => {
            notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current)
            responseListener && Notifications.removeNotificationSubscription(responseListener);
        }
    }, [])

    return (
        <Context.Provider value={{ notifications: notifications, markNotificationAsRead: markNotificationAsRead, registerForPushNotifications, clearNotifications }}>
            {children}
        </Context.Provider>
    )
}

export const useNotificationsContext = () => {
    const context = useContext(Context)
    return context
}