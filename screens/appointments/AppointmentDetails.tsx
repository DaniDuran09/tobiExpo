import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Platform } from "react-native";
import { Text, View, Avatar, TouchableOpacity } from "react-native-ui-lib";
import MapView, { Marker } from 'react-native-maps';
import ApiFetcher from "../../modules/ApiFetcher";
import { Appointment } from "./components/Item";
import { Colors } from "../../styles/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/es";
import { Linking } from 'react-native';

moment.locale("es");

const getServiceBadgeInfo = (status: string) => {
    switch (status) {
        case 'completed': return { label: 'Completada', bg: '#6A1B9A', text: '#FFF' };
        case 'checked_in':
        case 'arrived':
        case 'in_queue':
        case 'actived':
        case 'in_progress':
            return { label: 'En fila', bg: '#FFA000', text: '#FFF' };
        case 'no_show':
            return { label: 'No se presentó', bg: '#EF4136', text: '#FFF' };
        case 'cancelled':
            return { label: 'Cancelada', bg: '#EF4136', text: '#FFF' };
        case 'pending':
        case 'confirmed':
            return { label: 'Pendiente', bg: '#2196F3', text: '#FFF' };
        default: return null;
    }
};

export default function AppointmentDetails({ route }: { route: any }) {
    const { id } = route.params;
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(moment());

    const apiFetcher = new ApiFetcher();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await apiFetcher.getAppointmentsById(id);
            if (response.status) {
                setAppointment(response.data);
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
        const timer = setInterval(() => {
            setCurrentTime(moment());
        }, 60000);
        return () => clearInterval(timer);
    }, [id]);

    const openMap = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const partner = appointment?.partner;
        const lat = partner?.latitude || partner?.addresses?.[0]?.latitude;
        const lng = partner?.longitude || partner?.addresses?.[0]?.longitude;
        const latLng: string = `${lat},${lng}`;
        const label = 'Ubicación de la cita';
        const url: string | undefined = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        if (url && lat && lng) {
            Linking.openURL(url);
        }
    };

    if (loading) {
        return (
            <View flex center bg-white>
                <Text text70 color={Colors.gray}>Cargando...</Text>
            </View>
        );
    }

    if (!appointment) {
        return (
            <View flex center bg-white>
                <Text text70 color={Colors.gray}>No se encontró la cita</Text>
            </View>
        );
    }

    const firstService = appointment.appointment_pet_services[0];
    const appointmentMoment = firstService ? moment(firstService.appointment_time.start_time) : null;
    const shouldShowCheckIn = appointmentMoment && currentTime.isAfter(appointmentMoment.clone().subtract(15, 'minutes'));

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
            <View padding-20>
                {appointment.appointment_pet_services.map((service, index) => (
                    <View key={index} marginB-30>
                        <View row centerV marginB-15>
                            <Avatar source={{ uri: service.pet.picture }} size={40} />
                            <Text text60 marginL-15 style={{ fontWeight: '600' }}>
                                {service.pet.display_name || service.pet.name}
                            </Text>
                        </View>

                        <Text text70 style={{ fontWeight: '700' }} marginV-5>
                            {service.user.display_name || service.user.name}
                        </Text>

                        <Text text70BL color={Colors.blueLight} marginT-5>
                            {service.service.name}
                        </Text>
                        
                        {(() => {
                            const badgeInfo = getServiceBadgeInfo(service.status);
                            return badgeInfo ? (
                                <View marginT-5 style={{ backgroundColor: badgeInfo.bg, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                                    <Text text90 color={badgeInfo.text} style={{ fontWeight: '600' }}>{badgeInfo.label}</Text>
                                </View>
                            ) : null;
                        })()}

                        <Text text90L color={Colors.gray} marginV-2>
                            {service.user.role || "Especialista"}
                        </Text>

                        <View row centerV marginT-10>
                            <MaterialCommunityIcons name="pin-outline" size={20} color={Colors.black} />
                            <Text text80L marginL-10>
                                {appointment.partner.address ||
                                    (appointment.partner.addresses && appointment.partner.addresses.length > 0
                                        ? `${appointment.partner.addresses[0].street} ${appointment.partner.addresses[0].number}, ${appointment.partner.addresses[0].city}`
                                        : "Dirección no disponible")}
                            </Text>
                        </View>

                        <View row centerV marginT-5>
                            <MaterialCommunityIcons name="calendar-range-outline" size={20} color={Colors.black} />
                            <Text text80L marginL-10>
                                {moment(service.appointment_time.start_time).format("dddd, D MMMM.")}
                            </Text>
                        </View>

                        <View row centerV marginT-5>
                            <MaterialCommunityIcons name="clock-outline" size={20} color={Colors.black} />
                            <Text text80L marginL-10>
                                {`${moment(service.appointment_time.start_time).format("hh:mm a")} - ${moment(service.appointment_time.end_time).format("hh:mm a")} (GMT-6)`}
                            </Text>
                        </View>

                        {index < appointment.appointment_pet_services.length - 1 && (
                            <View height={1} bg-grey60 marginT-25 />
                        )}
                    </View>
                ))}

                {(() => {
                    const partner = appointment.partner;
                    const lat = partner?.latitude || partner?.addresses?.[0]?.latitude;
                    const lng = partner?.longitude || partner?.addresses?.[0]?.longitude;
                    if (lat && lng) {
                        return (
                            <View marginT-10 style={{ borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: Colors.secondGray, height: 150 }}>
                                <MapView
                                    style={{ flex: 1 }}
                                    region={{
                                        latitude: Number(lat),
                                        longitude: Number(lng),
                                        latitudeDelta: 0.005,
                                        longitudeDelta: 0.005,
                                    }}
                                    scrollEnabled={false}
                                    zoomEnabled={false}
                                    pitchEnabled={false}
                                    rotateEnabled={false}
                                    onPress={openMap}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: Number(lat),
                                            longitude: Number(lng),
                                        }}
                                        title={partner?.name}
                                    />
                                </MapView>
                            </View>
                        );
                    }
                    return null;
                })()}
            </View>

            {shouldShowCheckIn && (
                <View padding-20 center marginT-20 style={{ borderTopWidth: 1, borderTopColor: Colors.secondGray }}>
                    <Text text70L marginB-15>¿Confirmas que ya llegaste al lugar?</Text>
                    <TouchableOpacity
                        backgroundColor={Colors.primaryColor}
                        onPress={() => console.log("Confirmar llegada")}
                        style={{ height: 50, borderRadius: 25, width: '100%' }}
                        row
                        center
                    >
                        <Text white text70BO marginR-10>Sí, ya llegué</Text>
                        <MaterialCommunityIcons name="arrow-right" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({});