import { StyleSheet,View,Text } from "react-native"
import { Colors } from "../styles/Colors"
import ServiceOption from "./ServiceOption"

export function ServicesOptionsList({services=[],partnerLocation,users,partnerId}) {

    if(services.length == 0){
        return (
            <View style={styles.notServices}>
              <Text style={styles.itemDirection}>
                No hay servicios disponibles actualmente
              </Text>
            </View>
        )
    }

    return (
        <View style={styles.optionsContainer}>
            {services.map((service, index) => (
                <ServiceOption
                    key={index}
                    picture={service.picture}
                    service={service}
                    partnerLocation={partnerLocation}
                    listService={services}
                    users={users}
                    partnerId={partnerId}
                />
            ))}
        </View>
    )
}


const styles = StyleSheet.create({
    notServices: {
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    itemDirection: {
        fontSize: 15,
        marginTop: 5,
        color: Colors.gray,
    },
    optionsContainer: {
        marginTop: 10,
        flexDirection: "row",
        flexWrap: "wrap",
    },
})