import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { Alert, Platform } from "react-native";
import { useUpdateNotificationTokenMutation } from "../services/api/user.api";
import { notificationsApi, useGetNotificationsQuery } from "../services/api/notifications.api";
import { useDispatch } from "react-redux";

const Context = createContext({
    markNotificationAsRead: (notificationId: number) => { },
    registerForPushNotifications: () => { },
    clearNotifications: () => { }
} as {
    markNotificationAsRead: (notificationId: number) => void
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
    const notificationListener = useRef<Notifications.Subscription>();

    const [updateNotificationToken, { error }] = useUpdateNotificationTokenMutation();
    const dispatch = useDispatch()

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
            console.log("Project ID not found");
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            await updateNotificationToken({ expotoken: pushTokenString }).unwrap();
        } catch (e: unknown) {
            Alert.alert(`${e}`);
        }
    };


    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener(() => {
            dispatch(notificationsApi.util.invalidateTags([{ type: 'Notification', id: 'LIST' }]));
            // invalidate refetchNotifications();
        });

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
        };
    }, []);

    return (
        <Context.Provider
            value={{
                markNotificationAsRead: () => {},
                registerForPushNotifications,
                clearNotifications: () => {},
            }}
        >
            {children}
        </Context.Provider>
    );
}

export const useNotificationsContext = () => {
    const context = useContext(Context)
    return context
}