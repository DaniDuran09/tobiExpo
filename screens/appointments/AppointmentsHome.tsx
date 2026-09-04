import { useEffect, useState } from "react";
import { FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { Text, Toast, TouchableOpacity, View, Avatar } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import ApiFetcher from "../../modules/ApiFetcher";
import { Appointment } from "./components/Item";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/es";
import UploadImage from "../../components/atoms/UploadImage";

moment.locale("es");

export default function AppointmentsHome() {
    const route = useRoute<any>();
    const [selected, setSelected] = useState(route.params?.initialTab || 1);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Paginación
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const PER_PAGE = 10;

    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [uploadingPetId, setUploadingPetId] = useState<number | null>(null);
    const [uploadingCertificate, setUploadingCertificate] = useState(false);
    const [currentCertificate, setCurrentCertificate] = useState<string | null>(null);
    const navigation = useNavigation();

    const apiFetcher = new ApiFetcher();

    const fetchData = async (pageNum = 1) => {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        try {
            const statusParam = selected === 1 ? "pending" : "past";
            const response = await apiFetcher.getAppointments({
                status: statusParam,
                page: pageNum,
                per_page: PER_PAGE
            });

            if (response.status) {
                const newAppointments = response.data?.appointments || [];
                if (pageNum === 1) {
                    setAppointments(newAppointments);
                } else {
                    setAppointments(prev => [...prev, ...newAppointments]);
                }
                
                const meta = response.data?.meta;
                if (meta && meta.current_page >= meta.total_pages) {
                    setHasMore(false);
                } else if (!meta && newAppointments.length < PER_PAGE) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
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
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setAppointments([]);
        fetchData(1);
    }, [selected]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Refresca la pestaña actual al recibir foco
            setPage(1);
            fetchData(1);
        });
        return unsubscribe;
    }, [navigation, selected]);

    const handleOpenUpload = async (petId: number) => {
        setUploadingPetId(petId);
        setCurrentCertificate(null);
        setUploadModalVisible(true);
        try {
            const response = await apiFetcher.getCertificates(petId);
            setCurrentCertificate(response?.data?.certificate_vaccine || null);
        } catch (e) { }
    };

    const saveCertificateVaccine = async (uri: any, filename: any) => {
        if (!uploadingPetId) return;
        setUploadingCertificate(true);
        try {
            const formData = new FormData();
            formData.append("certificate_vaccine", {
                uri: uri,
                type: "image/jpeg",
                name: filename,
            } as any);
            await apiFetcher.saveCertificate(uploadingPetId, formData);
            setUploadModalVisible(false);
            Toast.show({
                type: "success",
                text1: "Certificado subido correctamente",
                text2: "El certificado de vacunación se ha subido correctamente",
            });
        } catch (error) {
            console.log(error);
        } finally {
            setUploadingCertificate(false);
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "pending":
                return { label: "Pendiente", color: Colors.gray, icon: "clock-outline", bg: '#b0b0b0' };
            case "confirmed":
            case "actived":
            case "checked_in":
                return { label: "Confirmada", color: Colors.green, icon: "check-circle-outline", bg: '#4caf50' };
            case "completed":
                return { label: "Completada", color: Colors.green, icon: "check-circle", bg: '#4caf50' };
            case "cancelled":
                return { label: "Cancelada", color: Colors.red, icon: "close-circle-outline", bg: '#f44336' };
            default:
                return { label: status, color: Colors.gray, icon: "information-outline", bg: '#b0b0b0' };
        }
    };

    const renderAppointmentGroup = ({ item: appointment, index }: { item: Appointment, index: number }) => {
        const capitalizeWords = (str: string) => str.replace(/\b\w/g, char => char.toUpperCase());

        const dateStr = capitalizeWords(moment(appointment.date_service).format("dddd, D [de] MMMM YYYY."));
        const timeFormatted = `${moment(appointment.date_service).format("hh:mm a")} (GMT-6)`;
        const statusInfo = getStatusInfo(appointment.appointment_status);

        return (
            <View marginH-20 marginB-30>
                <Text text70 color={Colors.black} marginB-10 style={{ fontWeight: '500' }}>CITA {index + 1}</Text>

                <View padding-15 style={{ borderWidth: 1, borderColor: Colors.secondGray, borderRadius: 2 }}>
                    <View row centerV marginB-5>
                        <MaterialCommunityIcons name="calendar-blank" size={16} color={Colors.gray} />
                        <Text text80 marginL-8 color={Colors.gray}>{dateStr}</Text>
                    </View>
                    <View row centerV marginB-10>
                        <MaterialCommunityIcons name="clock-outline" size={18} color={Colors.black} />
                        <Text text80BO marginL-8 color={Colors.black}>{timeFormatted}</Text>
                    </View>
                    <View row marginB-15>
                        <View row centerV paddingH-10 paddingV-4 style={{ backgroundColor: statusInfo.bg, borderRadius: 6 }}>
                            <MaterialCommunityIcons name={statusInfo.icon as any} size={14} color={Colors.white} />
                            <Text white marginL-4 text90 style={{ fontWeight: '600' }}>{statusInfo.label}</Text>
                        </View>
                    </View>

                    {appointment.appointment_pet_services?.map((aps: any, sIndex: number) => (
                        <View key={`srv-${sIndex}`}>
                            {sIndex > 0 && <View height={1} backgroundColor={Colors.secondGray} marginV-10 />}

                            <View row centerV marginB-10 marginT-5>
                                <Avatar source={{ uri: aps.pet.picture }} size={45} />
                                <Text text60BO marginL-15 color={Colors.black}>{aps.pet.display_name || aps.pet.name}</Text>
                            </View>

                            <View row centerV spread marginB-5 marginL-2>
                                <Text text70BO color={Colors.blueLight} flex marginR-10>{aps.service.name}</Text>
                                <Text text80 color={Colors.gray}>
                                    {aps.appointment_time ? moment(aps.appointment_time.start_time).format("hh:mm a") : moment(appointment.date_service).format("hh:mm a")}
                                </Text>
                            </View>
                            <Text text80 color={Colors.gray} marginL-2 marginB-5>{aps.user?.display_name || aps.user?.name}</Text>
                        </View>
                    ))}
                </View>

                <View marginT-15>
                    <TouchableOpacity
                        backgroundColor={Colors.primaryColor}
                        onPress={() => {
                            // @ts-ignore
                            navigation.navigate("AppointmentDetails", { id: appointment.id.toString() });
                        }}
                        style={{ height: 45, borderRadius: 25 }}
                        center
                    >
                        <Text white text70BO>Ver detalles</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderHistoryGroup = ({ item: appointment, index }: { item: Appointment, index: number }) => {
        const capitalizeWords = (str: string) => str.replace(/\b\w/g, char => char.toUpperCase());

        const dateStr = capitalizeWords(moment(appointment.date_service).format("dddd, D [de] MMMM."));

        const partner = appointment.partner as any;
        let address = "Dirección no disponible";
        if (partner?.address) {
            address = partner.address;
        } else if (partner?.addresses && partner.addresses.length > 0) {
            address = `${partner.addresses[0].street || ''} ${partner.addresses[0].number || ''}, ${partner.addresses[0].city || ''}`;
        } else if (partner?.latitude && partner?.longitude) {
            address = "Ver en el mapa";
        }

        if (!appointment.appointment_pet_services || appointment.appointment_pet_services.length === 0) return null;

        return (
            <View marginH-20 marginB-30>
                {appointment.appointment_pet_services.map((aps: any, sIndex: number) => {
                    const timeFormatted = aps.appointment_time ? moment(aps.appointment_time.start_time).format("hh:mm a") : moment(appointment.date_service).format("hh:mm a");
                    return (
                    <View key={`pet-srv-${sIndex}`}>
                        <View row centerV marginB-20>
                            <Avatar source={{ uri: aps.pet.picture }} size={45} />
                            <Text text60BO marginL-15 color={Colors.black}>{aps.pet.display_name || aps.pet.name}</Text>
                        </View>

                        <View style={{ backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderRadius: 8, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#eee' }}>
                            <View row spread centerV>
                                <Text text70BO color={Colors.black}>{aps.service.name}</Text>
                                <MaterialCommunityIcons name="check-circle-outline" size={20} color={Colors.green} />
                            </View>
                            <Text text90 color={Colors.gray} marginB-10 style={{ textTransform: 'uppercase' }}>SALUD</Text>

                            <Text text80 color={Colors.black}>{aps.user?.display_name || aps.user?.name || "Especialista"}</Text>
                            <Text text80 color={Colors.gray} numberOfLines={2}>{address}</Text>
                            <Text text80 color={Colors.black}>{dateStr}</Text>
                            <Text text80 color={Colors.black}>{timeFormatted} (GMT-6)</Text>
                        </View>

                        <View center marginT-10 marginB-20>
                            <Text text80 color={Colors.black} center marginB-5>El esquema de salud de {aps.pet.display_name || aps.pet.name} ya está actualizado.</Text>
                            <Text text80 color={Colors.black} center marginB-15>Guárdala en Tobi para que no se te pierda.</Text>
                            <TouchableOpacity
                                backgroundColor={Colors.red}
                                style={{ height: 45, borderRadius: 25, width: '100%' }}
                                center
                                onPress={() => handleOpenUpload(aps.pet.id)}
                            >
                                <Text white text70BO>Guardar cartilla de vacunación</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )})}
            </View>
        );
    };

    const renderItem = ({ item, index }: { item: Appointment, index: number }) => {
        if (selected === 1) {
            return renderAppointmentGroup({ item, index });
        } else {
            return renderHistoryGroup({ item, index });
        }
    };

    return (
        <View flex bg-white>
            <View row center marginT-20 marginB-20>
                <TouchableOpacity marginR-10 onPress={() => setSelected(1)}
                    style={{ borderBottomColor: Colors.primaryColor, borderBottomWidth: selected === 1 ? 2 : 0, paddingBottom: 5 }} >
                    <Text text70BL style={{ color: selected === 1 ? Colors.primaryColor : Colors.gray, fontWeight: '600' }}> Próximas </Text>
                </TouchableOpacity>
                <TouchableOpacity marginL-10 onPress={() => setSelected(2)}
                    style={{ borderBottomColor: Colors.primaryColor, borderBottomWidth: selected === 2 ? 2 : 0, paddingBottom: 5 }}>
                    <Text text70BL style={{ color: selected === 2 ? Colors.primaryColor : Colors.gray, fontWeight: '600' }}> Historial </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={appointments}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id.toString() + index}
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={() => { setPage(1); fetchData(1); }} />}
                onEndReached={() => {
                    if (hasMore && !loading && !loadingMore) {
                        const nextPage = page + 1;
                        setPage(nextPage);
                        fetchData(nextPage);
                    }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color={Colors.primaryColor} style={{ margin: 20 }} /> : null}
                ListEmptyComponent={
                    <View center marginT-40>
                        <Text text70 color={Colors.gray}>{loading ? "Cargando..." : (selected === 1 ? "No hay citas programadas" : "No hay citas en el historial")}</Text>
                    </View>
                }
            />
            <UploadImage
                loading={uploadingCertificate}
                type="vacunación"
                defaultImage={currentCertificate}
                visible={uploadModalVisible}
                onRequestClose={() => setUploadModalVisible(false)}
                onUpload={saveCertificateVaccine}
            />
        </View>
    );
}