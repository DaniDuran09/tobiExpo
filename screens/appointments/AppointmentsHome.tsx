import { useEffect, useState } from "react";
import { Text, Toast, TouchableOpacity, View } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import ApiFetcher from "../../modules/ApiFetcher";

export default function AppointmentsHome() {
    const [selected, setSelected] = useState(1);

    const apiFetcher = new ApiFetcher();

    const fetchData = async () => {
        try {
            const appointments = await apiFetcher.getAppointments();
        } catch (error) {
            console.log("error: ", error);
            Toast.show({
                type: "error",
                text1: "Ha ocurrido un error",
                text2: "Inténtelo de nuevo más tarde",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View >
            <View row center marginT-20 >
                <TouchableOpacity marginR-10 onPress={() => setSelected(1)}
                    style={{ borderBottomColor: Colors.primaryColor, borderBottomWidth: selected === 1 ? 2 : 0, }} >
                    <Text text70BL style={{ color: selected === 1 ? Colors.primaryColor : Colors.black }} > Próximas</Text>
                </TouchableOpacity>
                <TouchableOpacity marginL-10 onPress={() => setSelected(2)}
                    style={{ borderBottomColor: Colors.primaryColor, borderBottomWidth: selected === 2 ? 2 : 0, }}>
                    <Text text70BL style={{ color: selected === 2 ? Colors.primaryColor : Colors.black }}>Historial</Text>
                </TouchableOpacity>
            </View>
            {selected === 1 ?
                <View>
                    <Text text70BL>Proximos</Text>
                </View> :
                <View>
                    <Text text70BL>Historial</Text>
                </View>
            }
        </View>
    );
}