import { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { Text, Toast, TouchableOpacity, View, Avatar } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import ApiFetcher from "../../modules/ApiFetcher";
import { Visit } from "./components/Item";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

export default function AppointmentsHome() {
    const [selected, setSelected] = useState(1);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(false);
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

    const filterVisits = () => {
        if (selected === 1) {
            return visits.filter(v => v.status !== "completed" && v.status !== "cancelled");
        } else {
            return visits.filter(v => v.status === "completed" || v.status === "cancelled");
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

                {/* Footer Button */}
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
                renderItem={renderVisitGroup}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
                ListEmptyComponent={
                    <View center marginT-40>
                        <Text text70 color={Colors.gray}>{loading ? "Cargando..." : "No hay visitas programadas"}</Text>
                    </View>
                }
            />
        </View>
    );
}