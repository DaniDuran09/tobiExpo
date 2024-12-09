import { Text, Image, View } from "react-native-ui-lib";
import MapViewComponent from "./MapViewComponent";
import { Colors } from "../../styles/Colors";

export default function PartnersContactInformation({ partner }) {
  return (
    <View
      marginT-15
      paddingB-20
      style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.5 }}
    >
      <Text text50BO>Detalles</Text>
      <Text text70 marginT-5 marginB-5 color={Colors.gray}>
        Dirección
      </Text>
      <View centerH style={{ maxHeight: 240 }}>
        <MapViewComponent
          latitude={partner.latitude}
          longitude={partner.longitude}
          title={partner.name}
          description={partner.description}
        />
      </View>
      <Text text70 marginT-5 color={Colors.gray}>
        Información adicional
      </Text>
      <View marginT-20>
        <View row marginB-15>
          <Image
            source={require("../../assets/phone-icon.png")}
            resizeMode={"cover"}
            width={30}
            height={30}
            marginR-15
          />
          <View>
            <Text text60BO>Teléfono</Text>
            <Text text70 marginT-5 color={Colors.gray}>
              {partner.phone}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
