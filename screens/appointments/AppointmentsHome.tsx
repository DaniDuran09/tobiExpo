import { useEffect, useState } from "react";
import { ScrollView, FlatList } from "react-native";
import { Text, Toast, TouchableOpacity, View, Button } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import ApiFetcher from "../../modules/ApiFetcher";
import { AppointmentItem } from "./components/AppointmentItem";
import { Appointment } from "./components/Item";
import { useNavigation } from "@react-navigation/native";

export default function AppointmentsHome() {
    const [selected, setSelected] = useState(1);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const apiFetcher = new ApiFetcher();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await apiFetcher.getAppointments();
            if (response.status) {
                setAppointments(response.data);
            }
        } catch (error) {
            console.log("error: ", error);
            Toast.show({
                type: "error",
                text1: "Ha ocurrido un error",
                text2: "Inténtelo de nuevo más tarde",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filterAppointments = () => {
        if (selected === 1) {
            return appointments.filter(app => app.appointment_status !== "completed" && app.appointment_status !== "cancelled");
        } else {
            return appointments.filter(app => app.appointment_status === "completed" || app.appointment_status === "cancelled");
        }
    };

    const renderAppointmentGroup = ({ item: appointment }: { item: Appointment }) => (
        <View key={appointment.id} marginB-20>
            {appointment.appointment_pet_services.map((service, index) => (
                <AppointmentItem
                    key={`${appointment.id}-${index}`}
                    item={service}
                    partner={appointment.partner}
                    status={appointment.appointment_status}
                />
            ))}
            <View paddingH-20 marginT-10>
                <TouchableOpacity
                    backgroundColor={Colors.primaryColor}
                    onPress={() => {
                        console.log("Ver detalles", appointment.id)
                        // @ts-ignore - el stack está en js , problemas de tipado
                        navigation.navigate("AppointmentDetails", { id: appointment.id.toString() });
                    }}
                    style={{ height: 40, borderRadius: 25 }}
                    center
                >
                    <Text white text70BO>Ver detalles</Text>
                </TouchableOpacity>
            </View>
            <View height={1} bg-secondGray marginV-20 />
        </View>
    );

    return (
        <View flex bg-white>
            <View row center marginT-20 marginB-10>
                <TouchableOpacity marginR-10 onPress={() => setSelected(1)}
                    style={{ borderBottomColor: Colors.primaryColor, borderBottomWidth: selected === 1 ? 2 : 0, paddingBottom: 5 }} >
                    <Text text70BL style={{ color: selected === 1 ? Colors.primaryColor : Colors.black }} > Próximas</Text>
                </TouchableOpacity>
                <TouchableOpacity marginL-10 onPress={() => setSelected(2)}
                    style={{ borderBottomColor: Colors.primaryColor, borderBottomWidth: selected === 2 ? 2 : 0, paddingBottom: 5 }}>
                    <Text text70BL style={{ color: selected === 2 ? Colors.primaryColor : Colors.black }}>Historial</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filterAppointments()}
                renderItem={renderAppointmentGroup}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListEmptyComponent={
                    <View center marginT-40>
                        <Text text70 color={Colors.gray}>{loading ? "Cargando..." : "No hay citas disponibles"}</Text>
                    </View>
                }
            />
        </View>
    );
}