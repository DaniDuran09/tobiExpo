import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { Alert, Platform, Linking } from "react-native";
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

    const handledResponseIds = useRef<Set<string>>(new Set());

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

        const processNotificationResponse = async (response: Notifications.NotificationResponse) => {
            if (!response || !response.notification) return;

            // Extraer identificador único de la notificación para evitar procesarla más de una vez
            const notifId =
                response.notification.request.identifier ||
                `${response.notification.date}_${response.actionIdentifier || "default"}`;

            if (handledResponseIds.current.has(notifId)) {
                console.log("Notificación ya procesada en memoria:", notifId);
                return;
            }
            handledResponseIds.current.add(notifId);

            // Verificar en AsyncStorage si ya fue procesada en una apertura anterior (evita loop infinito de getLastNotificationResponseAsync)
            try {
                const storedRaw = await AsyncStorage.getItem("@tobi:handled_notification_ids");
                const handledList: string[] = storedRaw ? JSON.parse(storedRaw) : [];
                if (handledList.includes(notifId)) {
                    console.log("Notificación ya fue procesada previamente (evitando re-disparo):", notifId);
                    return;
                }
                const updatedList = [notifId, ...handledList].slice(0, 50);
                await AsyncStorage.setItem("@tobi:handled_notification_ids", JSON.stringify(updatedList));
            } catch (storageErr) {
                console.warn("Error leyendo/guardando handled_notification_ids:", storageErr);
            }

            const content = response.notification.request.content;
            const data = (content.data || {}) as any;
            
            // Extraer del nuevo payload estructurado
            let action = data?.action;
            const entity_fingerprint = data?.entity_fingerprint;
            // card_data contiene todos los IDs y metadata extra, si no viene fallback a data (por retrocompatibilidad)
            const card_data = data?.card_data || data;

            const notifType = (data?.type || card_data?.type || "").toLowerCase();
            const rawAction = (action || card_data?.action || "").toLowerCase();
            const title = (content.title || data?.title || card_data?.title || "").toLowerCase();
            const body = (content.body || data?.body || card_data?.body || "").toLowerCase();
            const deepLink = (data?.deep_link || data?.url || data?.link || card_data?.deep_link || card_data?.url || "").toLowerCase();
            const trigger = String(data?.trigger || data?.trigger_id || data?.communication || data?.communication_id || card_data?.trigger || card_data?.trigger_id || card_data?.communication || card_data?.communication_id || "").toLowerCase();
            const ctaLabel = String(data?.cta_label || data?.button_text || card_data?.cta_label || card_data?.button_text || "").toLowerCase();

            // Soporte para Comunicación 004 en notificaciones push
            if (!action && (
                trigger === "004" ||
                trigger === "4" ||
                title.includes("perfil creado") ||
                body.includes("completemos su esquema")
            )) {
                action = "complete_scheme";
            }

            // Soporte para Comunicación 018 (visit_completed / Ver estatus de salud -> PetPdf)
            const isPush018 =
                trigger === "018" ||
                trigger === "18" ||
                trigger === "visit_completed" ||
                notifType === "visit_completed" ||
                rawAction === "visit_completed" ||
                rawAction === "view_health_status" ||
                rawAction === "view_health_status_pdf" ||
                rawAction === "health_status" ||
                rawAction === "estatus_salud" ||
                rawAction === "estatus_salud_preventiva" ||
                rawAction === "view_pdf" ||
                rawAction === "pet_pdf" ||
                title.includes("estatus de salud") ||
                title.includes("estatus") ||
                body.includes("información de salud, descarga el documento") ||
                body.includes("estatus de salud") ||
                ctaLabel.includes("estatus") ||
                deepLink.includes("estatus") ||
                deepLink.includes("pdf") ||
                deepLink.includes("resumen-pdf") ||
                deepLink.includes("plan-preventivo") ||
                deepLink.includes("visit-completed");

            if (isPush018) {
                action = "view_health_status_pdf";
            }

            // Soporte para no_show en notificaciones push: solo si no hay otra acción definida o si la acción es explícitamente reagendar/no_show
            const actionStr = (action || "").toLowerCase();
            const isNoShowAction =
                actionStr.includes("no_show") ||
                actionStr.includes("reagendar") ||
                actionStr.includes("no_se_presento");

            const isNoShowTrigger =
                !action && (
                    notifType.includes("no_show") ||
                    notifType.includes("no_se_presento") ||
                    trigger === "no_show" ||
                    card_data?.status === "no_show" ||
                    card_data?.appointment_status === "no_show" ||
                    data?.status === "no_show"
                );

            if (isNoShowAction || isNoShowTrigger) {
                action = "no_show";
            }

            if (action) {
                // Esperar a que la navegación esté lista y haya salido de SplashScreen en caso de cold start
                const tryNavigate = () => {
                    const currentRoute = navigationRef.getCurrentRoute()?.name;
                    if (navigationRef.isReady() && currentRoute && currentRoute !== "SplashScreen") {
                        handleGlobalAction(action, card_data, entity_fingerprint, notifType, "Push");
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