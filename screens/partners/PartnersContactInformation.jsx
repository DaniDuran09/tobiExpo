import {Text, Image} from "react-native-ui-lib"
import { View,StyleSheet } from "react-native"
import MapViewComponent from "./MapViewComponent"
import { Colors } from "../../styles/Colors"

export default function PartnersContactInformation({partner}) {
    return (
        <View style={styles.servicesContainer}>
            <Text style={styles.itemTitle}>Detalles</Text>
            <Text style={styles.itemDirection}>Dirección</Text>
            <View style={styles.mapCompanyContain}>
                <MapViewComponent
                    latitude={partner.latitude}
                    longitude={partner.longitude}
                    title={partner.name}
                    description={partner.description}
                />
            </View>
            <Text style={styles.itemDirection}>Información adicional</Text>
            <View style={styles.extraInfo}>
                <View style={styles.flexContain}>
                    <Image
                        source={require("../../assets/phone-icon.png")}
                        style={styles.icon}
                        resizeMode={"cover"}
                    />
                    <View>
                        <Text style={styles.itemTitle}>Teléfono</Text>
                        <Text style={styles.itemDirection}>
                            {partner.phone}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    servicesContainer: {
        marginTop: 15,
        paddingBottom: 20,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 0.5,
    },
    itemTitle: {
        fontSize: 22,
        fontWeight: "700",
    },
    itemDirection: {
        fontSize: 15,
        marginTop: 5,
        color: Colors.gray,
    },
    mapContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    extraInfo: {
        marginTop: 20,
    },
    flexContain: {
        flexDirection: "row",
        marginBottom: 15,
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 15,
    },
    mapCompanyContain: {
        alignItems: "center",
        maxHeight: 240,
    },
})