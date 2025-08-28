import { useEffect, useState } from "react";
import useNotificationsPermissions from "../../hooks/useNotificationsPermission";
import Toast from "react-native-toast-message";

export default function NotificationPermissionDialog() {
    const [visible, setVisible] = useState(true)
    const { notificationPermissionResponse, requestNotificationPermissions } = useNotificationsPermissions()

    useEffect(()=>{
        handleOnPressOk();
    },[])
    const hide = () => {
        setVisible(false)
    }
    const handleOnPressOk = async () => {
        const response = await requestNotificationPermissions()
        
        if (!response.canAskAgain) {
            Toast.show({
                type: "error",
                text1: "Has desactivado las notificaciones",
                text2: `Puedes volver a activarlas desde configuraciones`,
            });
        }
        hide()
    }
    return null;
}