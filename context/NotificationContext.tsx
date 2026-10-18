import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleGlobalAction } from "../utils/ActionHandler";
import { navigationRef } from "../hooks/navigationRef";
import AppStorage from "../modules/AppStorage";
import ApiFetcher from "../modules/ApiFetcher";

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

            // Crear sesión de onboarding en el backend
            try {
                const apiFetcher = new ApiFetcher();
                await apiFetcher.createOnboardingSession(pushTokenString);
            } catch (sessionErr) {
                console.log("Error creando onboarding session:", sessionErr);
            }
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
            let action = data?.action;
            const entity_fingerprint = data?.entity_fingerprint;
            // card_data contiene todos los IDs y metadata extra, si no viene fallback a data (por retrocompatibilidad)
            const card_data = data?.card_data || data;

            // Soporte para Comunicación 004 en notificaciones push
            if (!action && (
                data?.trigger === "004" ||
                data?.communication === "004" ||
                data?.trigger_id === "004" ||
                data?.trigger_id === 4 ||
                data?.communication_id === "004" ||
                data?.communication_id === 4 ||
                card_data?.trigger === "004" ||
                card_data?.communication === "004"
            )) {
                action = "complete_scheme";
            }

            // Soporte para no_show en notificaciones push
            const notifType = data?.type || card_data?.type || "";
            const isNoShow = 
                (action || "").toLowerCase().includes("no_show") ||
                (notifType || "").toLowerCase().includes("no_show") ||
                (action || "").toLowerCase().includes("reagendar") ||
                card_data?.status === "no_show" ||
                card_data?.appointment_status === "no_show" ||
                data?.status === "no_show";

            if (isNoShow) {
                action = "no_show";
            }

            if (action) {
                // Esperar a que la navegación esté lista en caso de cold start
                const tryNavigate = () => {
                    if (navigationRef.isReady()) {
                        handleGlobalAction(action, card_data, entity_fingerprint, notifType);
                    } else {
                        setTimeout(tryNavigate, 100);
                    }
                };
                tryNavigate();
            } else if (data?.url || data?.link || data?.deep_link) {
                const url = data?.url || data?.link || data?.deep_link;
                Linking.openURL(url).catch(e => console.warn("Error abriendo deep link de notificación:", e));
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