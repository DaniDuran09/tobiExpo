import { useEffect, useState } from "react"
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

export default function useNotificationsPermissions() {
    const [notificationPermissionResponse, setNotificationPermissionResponse] = useState<Notifications.PermissionResponse | null>(null)

    useEffect(() => {
        const getPermissions = async () => {
            const response = await Notifications.getPermissionsAsync()
            setNotificationPermissionResponse(response)
        }
        getPermissions()
    }, [])

    const requestNotificationPermissions = async () => {
        const response = await Notifications.requestPermissionsAsync()
        setNotificationPermissionResponse(response)
        return response
    }

    return {
        notificationPermissionResponse,
        requestNotificationPermissions
    }
}