import { Colors } from "../../styles/Colors";
import ServiceOption from "./ServiceOption";
import { Text, View } from "react-native-ui-lib";

export function ServicesOptionsList({
  services = [],
  partnerLocation,
  users,
  partnerId,
}:{
  services:[],
  partnerLocation:unknown,
  users:[],
  partnerId:string
}) {
  if (services.length == 0) {
    return (
      <View marginT-10 center>
        <Text text70 marginT-5 color={Colors.gray}>
          No hay servicios disponibles actualmente
        </Text>
      </View>
    );
  }

  return (
    <View row marginT-10 gap-10 style={{ flexWrap: "wrap" }} >
      {services.map((service:any, index) => (
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
  );
}
