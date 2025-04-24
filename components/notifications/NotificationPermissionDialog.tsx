import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native-ui-lib";
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
            <View flex backgroundColor={Colors.danger} centerH padding-20>
                <View width={80} height={80} backgroundColor={Colors.black} padding-20 br100 marginB-20>
                    <Image
                        width={"100%"}
                        height={"100%"}
                        source={require("../../assets/notifications.png")}
                        tintColor={Colors.white}
                    />
                </View>
                <Text center text60BO marginB-20 color={Colors.black}>Te ayudo a que no se te pase lo que sí importa.</Text>
                <Text center text70BO color={Colors.black}>Sabemos que los días pasan volando... ¿Quieres que te avise cuando toque su vacuna, desparasitación o cita con el vet?</Text>
                <Image
                    source={require("../../assets/phone-notifications.png")}
                    width={"100%"}
                    style={{flex:1}}
                    resizeMode="contain"
                    marginT-40
                />
                <View marginT-20 center style={{marginBottom:20,width:"100%"}}>
                    <TouchableOpacity backgroundColor={Colors.black} padding-18 center br100 marginB-10
                        onPress={handleOnPressOk}
                       style={{width:"100%"}}
                    >
                        <Text center text60BO color={Colors.danger}>Permitir recordatorios</Text>
                    </TouchableOpacity>
                    <TouchableOpacity padding-10 br100
                        onPress={handleOnPressCancel}
                    >
                        <Text text60BO color={Colors.white}>Tal vez depués</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Toast />
        </Modal>
    )
}