import { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native-ui-lib";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import { Colors } from "../../styles/Colors";
import useNotificationsPermissions from "../../hooks/useNotificationsPermission";
import Toast from "react-native-toast-message";

export default function NotificationPermissionDialog() {
    const [visible, setVisible] = useState(true)
    const { notificationPermissionResponse, requestNotificationPermissions } = useNotificationsPermissions()


    const showDialog = () => {
        if (!visible || notificationPermissionResponse == null) {
            return false;
        }

        const { granted, canAskAgain } = notificationPermissionResponse;

        if (granted || !canAskAgain) {
            return false;
        }

        return true;
    }


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

    const handleOnPressCancel = () => {
        hide()
    }

    return (

        <Modal
            visible={showDialog()}
            onRequestClose={handleOnPressCancel}
            transparent={true}
        >
            <View flex backgroundColor="rgba(0,0,0,0.4)">
                <View width={"80%"} backgroundColor={Colors.white} center br20 padding-20 style={{ top: "20%", alignSelf: "center" }}>
                    <MaterialIcon name="bell-outline" size={32} color={Colors.black} style={{ marginBottom: 16 }} />
                    <Text text60 marginB-20 text80M>Activa las notificaciones para recibir recordatorios y actualizaciones sobre el bienestar de tus mascotas</Text>
                    <View width={"100%"} row style={{ justifyContent: "space-around" }} >
                        <TouchableOpacity backgroundColor={Colors.red} paddingH-20 paddingV-8 br100 onPress={async () => {
                            await handleOnPressOk()

                        }}>
                            <Text text80M color={Colors.white}>Aceptar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ borderColor: Colors.red, borderWidth: 2 }} paddingH-20 paddingV-8 br100 onPress={() => {
                            handleOnPressCancel()
                        }}>
                            <Text text80M>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Toast />
        </Modal>
    )
}