import { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { Text, Toast, TouchableOpacity, View, Avatar } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import ApiFetcher from "../../modules/ApiFetcher";
import { Visit } from "./components/Item";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/es";
import UploadImage from "../../components/atoms/UploadImage";

moment.locale("es");

export default function AppointmentsHome() {
    const route = useRoute<any>();
    const [selected, setSelected] = useState(route.params?.initialTab || 1);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [uploadingPetId, setUploadingPetId] = useState<number | null>(null);
    const [uploadingCertificate, setUploadingCertificate] = useState(false);
    const [currentCertificate, setCurrentCertificate] = useState<string | null>(null);
    const navigation = useNavigation();

    const apiFetcher = new ApiFetcher();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await apiFetcher.getVisits();
            if (response.status) {
                setVisits(response.data || []);
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
        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });
        return unsubscribe;
    }, [navigation]);

    const handleOpenUpload = async (petId: number) => {
        setUploadingPetId(petId);
        setCurrentCertificate(null);
        setUploadModalVisible(true);
        try {
            const response = await apiFetcher.getCertificates(petId);
            setCurrentCertificate(response?.data?.certificate_vaccine || null);
        } catch (e) {}
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

    const isVisitInHistory = (visit: Visit) => {
        if (visit.status === "completed" || visit.status === "cancelled" || visit.status === "no_show") return true;

        let hasServices = false;
        let allCompletedOrNoShow = true;

        if (visit.appointments) {
            visit.appointments.forEach((app: any) => {
                if (app.appointment_pet_services) {
                    app.appointment_pet_services.forEach((aps: any) => {
                        hasServices = true;
                        if (aps.status !== "completed" && aps.status !== "no_show" && aps.status !== "cancelled") {
                            allCompletedOrNoShow = false;
                        }
                    });
                }
            });
        }

        if (hasServices && allCompletedOrNoShow) return true;

        return false;
    };

    const filterVisits = () => {
        if (selected === 1) {
            return visits.filter(v => !isVisitInHistory(v));
        } else {
            return visits.filter(v => isVisitInHistory(v));
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

    const renderVisitGroup = ({ item: visit, index }: { item: Visit, index: number }) => {

        const capitalizeWords = (str: string) => str.replace(/\b\w/g, char => char.toUpperCase());

        const dateStr = capitalizeWords(moment(visit.expected_start_time).format("dddd, D [de] MMMM YYYY."));
        const timeFormatted = `${moment(visit.expected_start_time).format("hh:mm a")} - ${moment(visit.expected_end_time).format("hh:mm a")} (GMT-6)`;
        const statusInfo = getStatusInfo(visit.status);

        // Group services by pet
        const petsMap = new Map<number, { pet: any, services: any[] }>();
        if (visit.appointments) {
            visit.appointments.forEach(app => {
                if (app.appointment_pet_services) {
                    app.appointment_pet_services.forEach(aps => {
                        const petId = aps.pet?.id;
                        if (petId) {
                            if (!petsMap.has(petId)) {
                                petsMap.set(petId, { pet: aps.pet, services: [] });
                            }
                            petsMap.get(petId)!.services.push({
                                name: aps.service?.name || aps.service?.description || "Servicio",
                                time: aps.appointment_time ? moment(aps.appointment_time.start_time, "YYYY-MM-DD HH:mm:ss").format("hh:mm a") : moment(app.date_service).format("hh:mm a")
                            });
                        }
                    });
                }
            });
        }

        const petsList = Array.from(petsMap.values());

        return (
            <View marginH-20 marginB-30>
                <Text text70 color={Colors.black} marginB-10 style={{ fontWeight: '500' }}>VISITA {index + 1}</Text>

                <View padding-15 style={{ borderWidth: 1, borderColor: Colors.secondGray, borderRadius: 2 }}>
                    {/* Header: Date, Time, Status */}
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

                    {/* Pets & Services */}
                    {petsList.map((petGroup, pIndex) => (
                        <View key={`pet-${petGroup.pet.id}`}>
                            {pIndex > 0 && <View height={1} backgroundColor={Colors.secondGray} marginV-10 />}

                            <View row centerV marginB-10 marginT-5>
                                <Avatar source={{ uri: petGroup.pet.picture }} size={45} />
                                <Text text60BO marginL-15 color={Colors.black}>{petGroup.pet.display_name || petGroup.pet.name}</Text>
                            </View>

                            {petGroup.services.map((srv, sIndex) => (
                                <View row centerV spread marginB-5 marginL-2 key={`srv-${sIndex}`}>
                                    <Text text70BO color={Colors.blueLight} flex marginR-10>{srv.name}</Text>
                                    <Text text80 color={Colors.gray}>{srv.time}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                <View marginT-15>
                    <TouchableOpacity
                        backgroundColor={Colors.primaryColor}
                        onPress={() => {
                            // @ts-ignore
                            navigation.navigate("VisitDetails", { id: visit.id.toString(), isVisit: true });
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

    const renderHistoryGroup = ({ item: visit, index }: { item: Visit, index: number }) => {
        const capitalizeWords = (str: string) => str.replace(/\b\w/g, char => char.toUpperCase());

        const dateStr = capitalizeWords(moment(visit.expected_start_time).format("dddd, D [de] MMMM."));
        const timeFormatted = `${moment(visit.expected_start_time).format("hh:mm a")} - ${moment(visit.expected_end_time).format("hh:mm a")} (GMT-6)`;

        const partner = visit.partner as any;
        let address = "Dirección no disponible";
        if (partner?.address) {
            address = partner.address;
        } else if (partner?.addresses && partner.addresses.length > 0) {
            address = `${partner.addresses[0].street || ''} ${partner.addresses[0].number || ''}, ${partner.addresses[0].city || ''}`;
        }

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
                                time: aps.appointment_time ? moment(aps.appointment_time.start_time, "YYYY-MM-DD HH:mm:ss").format("hh:mm a") : moment(app.date_service).format("hh:mm a")
                            });
                        }
                    });
                }
            });
        }

        const petsList = Array.from(petsMap.values());

        // Si no hay mascotas procesadas, evitamos renderizar una tarjeta vacía
        if (petsList.length === 0) return null;

        return (
            <View marginH-20 marginB-30>
                {petsList.map((petGroup, pIndex) => (
                    <View key={`pet-${petGroup.pet.id}`}>
                        <View row centerV marginB-20>
                            <Avatar source={{ uri: petGroup.pet.picture }} size={45} />
                            <Text text60BO marginL-15 color={Colors.black}>{petGroup.pet.display_name || petGroup.pet.name}</Text>
                        </View>

                        {petGroup.services.map((srv, sIndex) => (
                            <View key={`srv-${sIndex}`} style={{ backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderRadius: 8, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#eee' }}>
                                <View row spread centerV>
                                    <Text text70BO color={Colors.black}>{srv.name}</Text>
                                    <MaterialCommunityIcons name="check-circle-outline" size={20} color={Colors.green} />
                                </View>
                                <Text text90 color={Colors.gray} marginB-10 style={{ textTransform: 'uppercase' }}>SALUD</Text>

                                <Text text80 color={Colors.black}>{srv.provider}</Text>
                                <Text text80 color={Colors.gray} numberOfLines={2}>{address}</Text>
                                <Text text80 color={Colors.black}>{dateStr}</Text>
                                <Text text80 color={Colors.black}>{srv.time} (GMT-6)</Text>
                            </View>
                        ))}

                        <View center marginT-10 marginB-20>
                            <Text text80 color={Colors.black} center marginB-5>El esquema de salud de {petGroup.pet.display_name || petGroup.pet.name} ya está actualizado.</Text>
                            <Text text80 color={Colors.black} center marginB-15>Guárdala en Tobi para que no se te pierda.</Text>
                            <TouchableOpacity
                                backgroundColor={Colors.red}
                                style={{ height: 45, borderRadius: 25, width: '100%' }}
                                center
                                onPress={() => handleOpenUpload(petGroup.pet.id)}
                            >
                                <Text white text70BO>Guardar cartilla de vacunación</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    const renderItem = ({ item, index }: { item: Visit, index: number }) => {
        if (selected === 1) {
            return renderVisitGroup({ item, index });
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
                data={filterVisits()}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
                ListEmptyComponent={
                    <View center marginT-40>
                        <Text text70 color={Colors.gray}>{loading ? "Cargando..." : (selected === 1 ? "No hay visitas programadas" : "No hay visitas en el historial")}</Text>
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