import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import useNotificationsPermissions from "../../hooks/useNotificationsPermission";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import * as Notifications from 'expo-notifications';

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
    /*
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
        )*/
    return (
        <Modal
            visible={showDialog()}
            onRequestClose={handleOnPressCancel}
        >
            <View style={{ backgroundColor: Colors.primaryColor, width: '100%', height: 50, paddingHorizontal: 10, paddingTop: 10 }}>
                <TouchableOpacity onPress={() => handleOnPressCancel()} style={{ width: 50, height: 50 }}>
                    <Icon name="chevron-left" size={45} color="black" />
                </TouchableOpacity>
            </View>
            <View flex centerH style={{
                backgroundColor: Colors.primaryColor
            }}>

                <Image
                    source={require("../../assets/images/Component-noti-1.png")}
                    style={{ width: 100, height: 100, marginBottom: 20 }}
                />
                <Text black text40BO>Te ayudo a que no se te pase</Text>
                <Text black text40BO>Lo que si importa 🐾</Text>
                <View height={40} />
                <Text black text60>Sabemos que los días pasan volando...</Text>
                <Text black text60BO>¿Quieres que te avise cuando toque su</Text>
                <Text black text60BO>vacuna, desparasitación o cita con el vet?</Text>
                <Text black text60BO marginB-30>TOBI está aquí para cuidar contigo 💚</Text>
                <Image
                    source={require("../../assets/phone-notification.png")}
                    style={{ marginVertical: 40, width: 300, height: 180, marginTop: 20 }}
                />
                <TouchableOpacity style={{ backgroundColor: 'black', padding: 10, borderRadius: 40, marginTop: 20, width: '80%', height: 70 }} center
                    onPress={async () => {
                        await handleOnPressOk()
                    }}
                >
                    <Text text50BL color={Colors.primaryColor}>Permitir recordatorios</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 10, width: '80%', height: 70 }} center
                    onPress={() => { handleOnPressCancel() }}
                >
                    <Text text50BL white>Tal vez después</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}