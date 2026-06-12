import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Platform, RefreshControl } from "react-native";
import { Text, View, Avatar, TouchableOpacity, Modal } from "react-native-ui-lib";
import MapView, { Marker } from 'react-native-maps';
import ApiFetcher from "../../modules/ApiFetcher";
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
        default: return null;
    }
};

export default function VisitDetails({ route, navigation }: { route: any, navigation: any }) {
    const { id } = route.params;
    const [visit, setVisit] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(moment());
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [checkingIn, setCheckingIn] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const apiFetcher = new ApiFetcher();

    const fetchData = async (isRefresh = false) => {
        if (isRefresh) setIsRefreshing(true);
        else setLoading(true);
        try {
            const response = await apiFetcher.getVisitById(id);
            if (response.status) {
                setVisit(response.data);
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
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
        const partner = visit?.partner
            || visit?.appointments?.[0]?.partner
            || visit?.appointments?.[0]?.appointment_pet_services?.[0]?.service?.service_ownered;
        if (!partner) return;

        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const lat = partner?.latitude || partner?.addresses?.[0]?.latitude;
        const lng = partner?.longitude || partner?.addresses?.[0]?.longitude;
        const latLng: string = `${lat},${lng}`;
        const label = partner?.name || 'Ubicación de la cita';
        const url: string | undefined = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        if (url && lat && lng) {
            Linking.openURL(url);
        }
    };

    const handleCheckIn = async () => {
        setCheckingIn(true);
        try {
            const res = await apiFetcher.checkinVisit(id);
            if (res.status) {
                setShowSuccessModal(true);
                // Also update local visit status and ALL pending services to checked_in so it looks right instantly
                setVisit((prev: any) => {
                    const next = { ...prev, status: 'checked_in' };
                    if (next.appointments) {
                        next.appointments = next.appointments.map((app: any) => ({
                            ...app,
                            appointment_pet_services: app.appointment_pet_services?.map((aps: any) => ({
                                ...aps,
                                status: aps.status === 'pending' || !aps.status ? 'checked_in' : aps.status
                            }))
                        }));
                    }
                    return next;
                });
            }
        } catch (e) {
            console.log("Error al hacer check-in", e);
        } finally {
            setCheckingIn(false);
        }
    };

    if (loading) {
        return (
            <View flex center bg-white>
                <Text text70 color={Colors.gray}>Cargando...</Text>
            </View>
        );
    }

    if (!visit) {
        return (
            <View flex center bg-white>
                <Text text70 color={Colors.gray}>No se encontró la visita</Text>
            </View>
        );
    }

    // Process pets & services
    const petsMap = new Map<number, { pet: any, services: any[] }>();
    if (visit.appointments) {
        visit.appointments.forEach((app: any) => {
            if (app.appointment_pet_services) {
                app.appointment_pet_services.forEach((aps: any) => {
                    const petId = aps.pet?.id;
                    if (petId) {
                        if (!petsMap.has(petId)) {
                            petsMap.set(petId, { pet: aps.pet, services: [] });
                        }
                        petsMap.get(petId)!.services.push({
                            name: aps.service?.name || aps.service?.description || "Servicio",
                            provider: aps.user?.display_name || aps.user?.name || "Especialista",
                            role: aps.user?.role || "Especialista",
                            startTime: moment(aps.appointment_time?.start_time).format("hh:mm a"),
                            endTime: moment(aps.appointment_time?.end_time).format("hh:mm a"),
                            status: (aps.status === 'pending' || !aps.status) ? visit.status : aps.status
                        });
                    }
                });
            }
        });
    }

    const petsList = Array.from(petsMap.values());

    const partner = visit?.partner
        || visit?.appointments?.[0]?.partner
        || visit?.appointments?.[0]?.appointment_pet_services?.[0]?.service?.service_ownered;
    console.log(partner?.addresses)

    const buildAddress = (p: any): string => {
        if (!p) return "Dirección no disponible";
        if (p.address) return p.address;
        const a = p.addresses?.[0];
        if (a) {
            const parts = [a.street, a.number, a.city, a.state].filter(Boolean);
            return parts.join(', ');
        }
        return "Dirección no disponible";
    };
    const address = buildAddress(partner);
    const partnerPhone = partner?.phone || null;

    const capitalizeWords = (str: string) => str.replace(/\b\w/g, char => char.toUpperCase());
    const dateStr = capitalizeWords(moment(visit.expected_start_time).format("dddd, D [de] MMMM YYYY."));

    const visitMoment = moment(visit.expected_start_time);
    const isWithin15MinsOrAfter = visitMoment && currentTime.isAfter(visitMoment.clone().subtract(15, 'minutes'));

    // Status Logic
    const isCheckedInAtAll = visit.status === 'checked_in' || visit.status === 'actived' || visit.status === 'in_progress' || visit.status === 'completed';
    const isNoShow = visit.status === 'no_show' || (petsList.length > 0 && petsList.every(p => p.services.every(s => s.status === 'no_show')));
    const hasCompletedService = petsList.some(p => p.services.some(s => s.status === 'completed'));
    const allServicesCompleted = petsList.length > 0 && petsList.every(p => p.services.every(s => s.status === 'completed'));

    const shouldShowCheckIn = !isCheckedInAtAll && !isNoShow && (visit.status === 'confirmed' || visit.status === 'pending');

    return (
        <>
            <ScrollView
                style={{ flex: 1, backgroundColor: 'white' }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => fetchData(true)}
                        colors={[Colors.primaryColor]}
                        tintColor={Colors.primaryColor}
                    />
                }
            >
                <View padding-20>
                    {/* Estado de la Visita Tracker */}
                    {isCheckedInAtAll && !isNoShow && (
                        <View marginB-20 padding-15 style={{ borderWidth: 1, borderColor: Colors.secondGray, borderRadius: 8 }}>
                            <Text text80L color={Colors.gray} marginB-15>ESTADO DE LA VISITA</Text>

                            <View row centerV marginB-10>
                                <MaterialCommunityIcons name="circle" size={12} color={Colors.green} />
                                <Text text80 marginL-10 color={Colors.black}>Check-in realizado</Text>
                            </View>

                            <View row centerV marginB-10>
                                <MaterialCommunityIcons name="circle" size={12} color="#FFA000" />
                                <Text text80 marginL-10 color={Colors.black}>En fila</Text>
                            </View>

                            <View row centerV>
                                <MaterialCommunityIcons
                                    name={hasCompletedService ? "circle" : "circle-outline"}
                                    size={12}
                                    color={hasCompletedService ? "#6A1B9A" : Colors.gray}
                                />
                                <Text text80 marginL-10 color={Colors.black}>Completada</Text>
                            </View>
                        </View>
                    )}

                    {/* Pets Cards in new layout */}
                    {petsList.map((petGroup, index) => (
                        <View key={index} marginB-30>
                            <View row centerV marginB-15>
                                <Avatar source={{ uri: petGroup.pet.picture }} size={45} />
                                <Text text60 marginL-15 style={{ fontWeight: '600' }}>
                                    {petGroup.pet.display_name || petGroup.pet.name}
                                </Text>
                            </View>

                            <View height={1} bg-grey60 marginB-15 />

                            {petGroup.services.map((service, sIdx) => {
                                const badgeInfo = getServiceBadgeInfo(service.status);

                                return (
                                    <View key={sIdx} marginB-20>
                                        <View row centerV spread>
                                            <Text text70BL color={Colors.blueLight} flex marginR-10>
                                                {service.name}
                                            </Text>
                                            <Text text80 color={Colors.gray}>
                                                {service.startTime}
                                            </Text>
                                        </View>

                                        <Text text90L color={Colors.gray} marginV-2>
                                            {service.role}
                                        </Text>

                                        <View row centerV marginT-10>
                                            <MaterialCommunityIcons name="home-outline" size={20} color={Colors.black} />
                                            <Text text80L marginL-10>
                                                {partner?.name || service.provider}
                                            </Text>
                                        </View>

                                        <View row centerV marginT-5>
                                            <MaterialCommunityIcons name="calendar-range-outline" size={20} color={Colors.black} />
                                            <Text text80L marginL-10>
                                                {dateStr}
                                            </Text>
                                        </View>

                                        <View row centerV marginT-5>
                                            <MaterialCommunityIcons name="pin-outline" size={20} color={Colors.black} />
                                            <Text text80L marginL-10>
                                                {address}
                                            </Text>
                                        </View>

                                        {partnerPhone && (
                                            <View row centerV marginT-5>
                                                <MaterialCommunityIcons name="phone-outline" size={20} color={Colors.black} />
                                                <Text text80L marginL-10>
                                                    {partnerPhone}
                                                </Text>
                                            </View>
                                        )}

                                        {badgeInfo && (
                                            <View marginT-10 style={{ backgroundColor: badgeInfo.bg, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                                                <Text text90 color={badgeInfo.text} style={{ fontWeight: '600' }}>{badgeInfo.label}</Text>
                                            </View>
                                        )}

                                        {sIdx < petGroup.services.length - 1 && (
                                            <View height={1} bg-grey60 marginT-15 marginB-15 />
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    ))}

                    {/* Map Fragment */}
                    {(() => {
                        const lat = Number(partner?.latitude || partner?.addresses?.[0]?.latitude);
                        const lng = Number(partner?.longitude || partner?.addresses?.[0]?.longitude);
                        if (lat && lng) {
                            return (
                                <View marginT-10 style={{ borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: Colors.secondGray, height: 150 }}>
                                    <MapView
                                        style={{ width: '100%', height: 150 }}
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

                {/* Bottom Banners */}
                {isNoShow ? (
                    <View padding-20 marginB-20>
                        <View row centerV>
                            <MaterialCommunityIcons name="close-circle" size={20} color={Colors.red} />
                            <Text text80 marginL-10 color={Colors.black}>Esta cita pasó y no registraste llegada.</Text>
                        </View>
                    </View>
                ) : allServicesCompleted ? (
                    <View padding-20 marginB-20>
                        <View row centerV marginB-15>
                            <MaterialCommunityIcons name="check-circle" size={20} color={Colors.green} />
                            <Text text80 marginL-10 color={Colors.black}>
                                Se actualizó el historial de salud de {petsList.map(p => p.pet.display_name || p.pet.name).join(', ')}.
                            </Text>
                        </View>
                        <TouchableOpacity
                            backgroundColor={Colors.primaryColor}
                            onPress={() => {

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
                            <MaterialCommunityIcons name="check-circle" size={20} color={Colors.green} />
                            <Text text80 marginL-10 color={Colors.black}>Tu llegada fue registrada. Te avisaremos cuando sea tu turno.</Text>
                        </View>
                    </View>
                ) : (shouldShowCheckIn && isWithin15MinsOrAfter) ? (
                    <View padding-20 center marginB-20 style={{ borderTopWidth: 1, borderTopColor: Colors.secondGray }}>
                        <Text text70L marginB-15>Confirma tu llegada</Text>
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
                ) : null}
            </ScrollView>

            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View flex center style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View bg-white padding-20 style={{ borderRadius: 15, width: '85%', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="check-circle" size={40} color={Colors.green} />
                        <Text text60BO marginT-10>Hiciste check-in</Text>
                        <Text text80 color={Colors.gray} marginT-10 style={{ textAlign: 'center' }}>
                            Ya avisamos al establecimiento.
                        </Text>
                        <Text text80 color={Colors.gray} marginB-20 style={{ textAlign: 'center' }}>
                            Te atenderán pronto.
                        </Text>

                        <View row centerV marginB-20>
                            <MaterialCommunityIcons name="information-outline" size={20} color={Colors.red} />
                            <Text text90 color={Colors.gray} marginL-5>
                                Permanece cerca para no perder tu turno.
                            </Text>
                        </View>

                        <TouchableOpacity
                            backgroundColor={Colors.primaryColor}
                            onPress={() => {
                                setShowSuccessModal(false);
                            }}
                            style={{ height: 45, borderRadius: 20, width: '100%' }}
                            center
                        >
                            <Text white text70BO>Ver estado de la visita</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}
