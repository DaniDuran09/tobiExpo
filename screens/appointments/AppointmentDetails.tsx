import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Platform } from "react-native";
import { Text, View, Avatar, TouchableOpacity, Modal } from "react-native-ui-lib";
import MapView, { Marker } from 'react-native-maps';
import ApiFetcher from "../../modules/ApiFetcher";
import { Appointment } from "./components/Item";
import { Colors } from "../../styles/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/es";
import { Linking } from 'react-native';
import { openWhatsAppTobi } from "../../utils/openWhatsApp";

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

export default function AppointmentDetails({ route, navigation }: { route: any, navigation: any }) {
    const { id } = route.params;
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(moment());
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const apiFetcher = new ApiFetcher();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await apiFetcher.getAppointmentsById(id);
            if (response.status) {
                console.log("APPOINTMENT DETAILS RESPONSE:", JSON.stringify(response.data, null, 2));
                setAppointment(response.data);
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
        }
    };


    const [checkingIn, setCheckingIn] = useState(false);

    useEffect(() => {
        fetchData();
        const timer = setInterval(() => {
            setCurrentTime(moment());
        }, 60000);
        return () => clearInterval(timer);
    }, [id]);

    const handleCheckIn = async () => {
        setCheckingIn(true);
        try {
            const res = await apiFetcher.checkinAppointment(id);
            if (res.status || res.code === 200) {
                // Refresh data after checkin
                await fetchData();
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.log("Error al hacer check-in", error);
        } finally {
            setCheckingIn(false);
        }
    };

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
    const currentStatus = appointment.appointment?.appointment_status || appointment.appointment_status || (appointment as any).status || firstService?.status;
    
    const shouldShowCheckIn = appointmentMoment && 
        currentTime.isAfter(appointmentMoment.clone().subtract(15, 'minutes')) && 
        !['checked_in', 'in_queue', 'in_progress', 'completed', 'actived'].includes(currentStatus);

    const isCheckedInAtAll = currentStatus && ['checked_in', 'in_queue', 'in_progress', 'completed', 'actived'].includes(currentStatus);
    const isNoShow = currentStatus === 'no_show';

    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
                <View padding-20>
                    {/* Estado de la Visita Tracker */}
                    {isCheckedInAtAll && !isNoShow && (
                        <View marginB-20 padding-15 style={{ borderWidth: 1, borderColor: Colors.secondGray, borderRadius: 8 }}>
                            <Text text80L color={Colors.gray} marginB-15>ESTADO DE LA VISITA</Text>

                            <View row centerV marginB-10>
                                <MaterialCommunityIcons name="circle" size={12} color={Colors.green} />
                                <Text text80 marginL-10 color={Colors.black}>Check-in realizado</Text>
                            </View>
                            
                            <View height={20} width={1} bg-grey60 style={{ marginLeft: 5, marginTop: -5, marginBottom: -5 }} />
                            
                            <View row centerV marginB-10>
                                <MaterialCommunityIcons name="circle" size={12} color={['in_queue', 'in_progress', 'actived', 'completed'].includes(currentStatus) ? '#FFA000' : Colors.gray} />
                                <Text text80 marginL-10 color={['in_queue', 'in_progress', 'actived', 'completed'].includes(currentStatus) ? '#FFA000' : Colors.black}>En fila</Text>
                            </View>

                            <View height={20} width={1} bg-grey60 style={{ marginLeft: 5, marginTop: -5, marginBottom: -5 }} />
                            
                            <View row centerV>
                                <MaterialCommunityIcons name={currentStatus === 'completed' ? "circle" : "circle-outline"} size={12} color={currentStatus === 'completed' ? '#6A1B9A' : Colors.black} />
                                <Text text80 marginL-10 color={currentStatus === 'completed' ? '#6A1B9A' : Colors.black}>Completada</Text>
                            </View>
                        </View>
                    )}

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
                            const badgeInfo = getServiceBadgeInfo(service.status || currentStatus);
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
                        onPress={handleCheckIn}
                        disabled={checkingIn}
                        style={{ height: 50, borderRadius: 25, width: '100%', opacity: checkingIn ? 0.7 : 1 }}
                        row
                        center
                    >
                        <Text white text70BO marginR-10>{checkingIn ? "Cargando..." : "Sí, ya llegué"}</Text>
                        <MaterialCommunityIcons name="arrow-right" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )}

            {isNoShow ? (
                <View padding-20 marginB-20>
                    <View row centerV marginB-15>
                        <MaterialCommunityIcons name="alert-circle-outline" size={20} color={Colors.red} />
                        <Text text80 marginL-10 color={Colors.black}>Esta cita pasó y no registraste llegada.</Text>
                    </View>
                    <View center marginT-10 marginB-10>
                        <Text text70BO color={Colors.black} center marginB-5>
                            ¿Quieres reagendar la cita de {appointment.appointment_pet_services.map(s => s.pet.display_name || s.pet.name).join(', ') || "tu mascota"}?
                        </Text>
                        <Text text80 color={Colors.gray} center marginB-15>
                            Escríbenos y te ayudamos a encontrar un nuevo horario.
                        </Text>
                        <TouchableOpacity
                            backgroundColor={Colors.primaryColor}
                            style={{ height: 45, borderRadius: 25, width: '100%' }}
                            center
                            onPress={() => openWhatsAppTobi({
                                pet_name: appointment.appointment_pet_services.map(s => s.pet.display_name || s.pet.name).join(', '),
                                appointment_id: appointment.id,
                                date: appointment.date_service,
                            })}
                        >
                            <Text white text70BO>Contactar a Tobi para reagendar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : currentStatus === 'completed' ? (
                <View padding-20 marginB-20>
                    <View row centerV marginB-15>
                        <MaterialCommunityIcons name="check-box-outline" size={20} color={Colors.green} />
                        <Text text80 marginL-10 color={Colors.black}>
                            Se actualizó el historial de salud de {appointment.appointment_pet_services.map(s => s.pet.display_name || s.pet.name).join(', ')}.
                        </Text>
                    </View>
                    <TouchableOpacity
                        backgroundColor={Colors.primaryColor}
                        onPress={() => {
                            // Logic to navigate to health history if needed in the future
                        }}
                        style={{ height: 50, borderRadius: 25, width: '100%' }}
                        center
                    >
                        <Text white text70BO>Ver historial de salud</Text>
                    </TouchableOpacity>
                </View>
            ) : isCheckedInAtAll ? (
                <View padding-20 marginB-20>
                    <View row centerV>
                        <MaterialCommunityIcons name="check-box-outline" size={20} color={Colors.green} />
                        <Text text80 marginL-10 color={Colors.black}>Tu llegada fue registrada. Te avisaremos cuando sea tu turno.</Text>
                    </View>
                </View>
            ) : null}
        </ScrollView>
        
            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View flex center style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View bg-white padding-20 style={{ borderRadius: 15, width: '85%', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="check-circle" size={40} color={Colors.green} />
                        <Text text60BO marginT-10>Hiciste check-in</Text>
                        <Text text80 color={Colors.gray} marginT-10 style={{ textAlign: 'center' }}>
                            Ya avisamos al establecimiento. Te atenderán pronto.
                        </Text>
                        <View row centerV marginT-15>
                            <MaterialCommunityIcons name="alert-circle-outline" size={16} color={Colors.red} />
                            <Text text90 color={Colors.red} marginL-5>Permanece cerca para no perder tu turno.</Text>
                        </View>
                        <TouchableOpacity
                            backgroundColor={Colors.red}
                            style={{ height: 45, borderRadius: 25, width: '100%', marginTop: 20 }}
                            center
                            onPress={() => {
                                setShowSuccessModal(false);
                            }}
                        >
                            <Text white text70BO>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({});