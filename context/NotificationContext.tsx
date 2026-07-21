import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleGlobalAction } from "../utils/ActionHandler";
import { navigationRef } from "../hooks/navigationRef";
import AppStorage from "../modules/AppStorage";

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
            // Guardar en storage para usarlo al hacer logout
            const appStorage = new AppStorage();
            await appStorage.saveExpoPushToken(pushTokenString);
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

        const processNotificationResponse = (response: Notifications.NotificationResponse) => {
            const data = response.notification.request.content.data;
            
            // Extraer del nuevo payload estructurado
            const action = data?.action;
            const entity_fingerprint = data?.entity_fingerprint;
            // card_data contiene todos los IDs y metadata extra, si no viene fallback a data (por retrocompatibilidad)
            const card_data = data?.card_data || data;

            if (action) {
                // Esperar a que la navegación esté lista en caso de cold start
                const tryNavigate = () => {
                    if (navigationRef.isReady()) {
                        handleGlobalAction(action, card_data, entity_fingerprint);
                    } else {
                        setTimeout(tryNavigate, 100);
                    }
                };
                tryNavigate();
            } else {
                console.warn("Notificación sin action, no se pudo redirigir:", data);
            }
        };

        // Handle app opened from a completely dead state
        Notifications.getLastNotificationResponseAsync().then(response => {
            if (response) {
                processNotificationResponse(response);
            }
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            processNotificationResponse(response);
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