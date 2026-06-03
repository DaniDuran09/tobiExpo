import React from "react";
import { View, Text, Avatar } from "react-native-ui-lib";
import { Colors } from "../../../styles/Colors";
import { AppointmentPetService, Partner } from "./Item";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

interface Props {
    item: AppointmentPetService;
    partner: Partner;
    status: string;
}

export const AppointmentItem = ({ item, partner, status }: Props) => {
    const { pet, service, user, appointment_time } = item;

    // Format date: "jueves, 13 noviembre."
    const dateFormatted = moment(appointment_time.start_time).format("dddd, D MMMM.");
    // Format time: "11:00 a.m. - 12:00 p.m. (GMT-6)"
    const startTime = moment(appointment_time.start_time).format("hh:mm a");
    const endTime = moment(appointment_time.end_time).format("hh:mm a");

    // Map status to label and color
    const getStatusInfo = (status: string) => {
        switch (status) {
            case "pending":
                return { label: "Pendiente", color: Colors.gray, icon: "clock-outline" };
            case "confirmed":
            case "actived":
                return { label: "Confirmada", color: Colors.green, icon: "check-circle-outline" };
            case "completed":
                return { label: "Completada", color: Colors.green, icon: "check-circle" };
            case "cancelled":
                return { label: "Cancelada", color: Colors.red, icon: "close-circle-outline" };
            default:
                return { label: status, color: Colors.gray, icon: "information-outline" };
        }
    };

    const statusInfo = getStatusInfo(status);

    return (
        <View marginH-20 marginT-20>
            {/* Pet Info */}
            <View row centerV marginB-20>
                <Avatar source={{ uri: pet.picture }} size={40} />
                <Text text50 marginL-20 style={{ fontWeight: '600' }}>{pet.display_name || pet.name}</Text>
            </View>

            {/* Card Content Bordered */}
            <View padding-10 style={{ borderWidth: 1, borderColor: Colors.secondGray, borderRadius: 2 }}>
                <Text text60BO style={{ fontSize: 18 }}>{user.display_name || user.name}</Text>

                <Text text70BL color={Colors.blueLight} marginT-10>
                    {service.name}
                </Text>

                {/*<Text text90L color={Colors.gray} marginV-15 style={{ fontSize: 16 }}>
                    {service.description || "Servicio"}
                </Text>*/}

                <View height={1} bg-grey50 marginB-10 />

                <View row centerV marginB-10>
                    <MaterialCommunityIcons name="pin-outline" size={24} color={Colors.black} />
                    <Text text80L marginL-12 style={{ fontSize: 15 }}>
                        {partner.addresses && partner.addresses.length > 0
                            ? `${partner.addresses[0].state}, ${partner.addresses[0].street} ${partner.addresses[0].number}`
                            : partner.address || "Dirección no disponible"}
                    </Text>
                </View>

                <View row centerV marginB-10>
                    <MaterialCommunityIcons name="calendar-range-outline" size={24} color={Colors.black} />
                    <Text text80L marginL-12 style={{ fontSize: 15 }}>{dateFormatted}</Text>
                </View>

                <View row centerV marginB-15>
                    <MaterialCommunityIcons name="clock-outline" size={24} color={Colors.black} />
                    <Text text80L marginL-12 style={{ fontSize: 15 }}>{`${startTime} - ${endTime} (GMT-6)`}</Text>
                </View>

                <View row>
                    <View row centerV paddingH-15 paddingV-1 style={{ backgroundColor: '#4caf50', borderRadius: 8 }}>
                        <MaterialCommunityIcons name="clock-time-four-outline" size={20} color={Colors.white} />
                        <Text white marginL-8 text80>{statusInfo.label}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};