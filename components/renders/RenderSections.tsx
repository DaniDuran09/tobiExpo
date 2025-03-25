import { StyleSheet } from "react-native";
import React from "react";
import momentTZ from "../../utils/moment";
import { AnimatedImage, LoaderScreen, Text, View } from "react-native-ui-lib";
import Section from "../pet/Section";
import { Colors } from "../../styles/Colors";
import { calculateIdealWeight } from "../../utils/scripts";
import Icon from "react-native-vector-icons/Entypo";

interface PetItem {
  name: string;
  picture: string;
  service_date?: string;
  weight_status?: {
    ideal_weight?: {
      from: number;
      to: number;
    };
    weight: number;
  };
  weight: number;
}

interface RenderSectionsProps {
  item: PetItem;
}

const RenderSections: React.FC<RenderSectionsProps> = ({ item }) => {
  const calculateRemainingDays = (serviceDate: any, today: any) => {
    const daysDifference = Math.ceil(serviceDate.diff(today, "hours") / 24);
    if (daysDifference < 0) return { text: "---", color: "black" };
    if (daysDifference === 0) return { text: "La cita es hoy", color: "green" };
    return {
      text: `${daysDifference} ${daysDifference !== 1 ? "días" : "día"}`,
      color: "green",
    };
  };

  const getServiceDateInfo = (serviceDate: string) =>
    momentTZ(serviceDate).utc().format("DD.MMM");

  const getServiceStatus = (item: PetItem) => {
    if (!item?.service_date)
      return { service: "---", remainingDays: { text: "---", color: "green" } };
    const serviceDate = momentTZ(item.service_date, "YYYY-MM-DDTHH:mm:ssZ")
      .tz("America/Mexico_City")
      .startOf("day");
    const today = momentTZ().tz("America/Mexico_City").startOf("day");
    const remainingDays = calculateRemainingDays(serviceDate, today);
    return {
      service:
        remainingDays.text !== "---"
          ? getServiceDateInfo(item.service_date)
          : "---",
      remainingDays,
    };
  };

  const rangeOne = (item.weight_status?.ideal_weight?.from ?? 0) / 1000;
  const rangeTwo = (item.weight_status?.ideal_weight?.to ?? 0) / 1000;
  const realWeight = calculateIdealWeight(
    rangeOne,
    rangeTwo,
    item.weight_status?.weight ?? 0
  );

  const { service, remainingDays } = getServiceStatus(item);

  const calculateDeviationPercentage = (weight: number, rangeFrom: number, rangeTo: number) => {
    if (weight < rangeFrom) {
      return ((rangeFrom - weight) / rangeFrom) * 100;
    } else if (weight > rangeTo) {
      return ((weight - rangeTo) / rangeTo) * 100;
    }
    return 0;
  };

  const deviationPercentage = calculateDeviationPercentage(
    item.weight,
    rangeOne,
    rangeTwo
  );

  return (
    <View marginB-25>
      <View row centerV gap-10 marginB-10>
        <AnimatedImage
          source={{ uri: item.picture }}
          style={{ height: 35, width: 35, borderRadius: 32 }}
          loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
          animationDuration={500}
        />
        <Text text70BO marginL-10>
          {item.name}
        </Text>
      </View>
      <View row spread>
        <Section item={item} tabIndex={0}>
          <Text text70BL>VACUNAS</Text>
          <Text text90M>Próximos vencimientos</Text>
          <Text text80BL>{service}</Text>
          <Text text90MM>Faltan</Text>
          <Text color={remainingDays.color} text80BO>
            {remainingDays.text}
          </Text>
          <View style={{ alignSelf: "flex-end" }}>
            <Text>+ info</Text>
          </View>
        </Section>
        <Section item={item} tabIndex={1}>
          <Text text70BL>BIENESTAR</Text>
          <Text text90M>Recomendación</Text>
          <Text text80BL>---</Text>
          <View style={{ alignSelf: "flex-end" }}>
            <Text>+ info</Text>
          </View>
        </Section>
      </View>
      <View row spread marginT-10>
        <Section item={item} tabIndex={2}>
          <Text text70BL>PESO</Text>
          <View row>
            <View>
              <Text text90M>Rango ideal</Text>
              <Text text70BO>{`${rangeOne} Kg - ${rangeTwo} Kg`}</Text>
            </View>
          </View>
          <Text text90M>Real</Text>
          <View row>
            <View>
              <Text color={realWeight?.ideal ? Colors.green : "red"} text70BO>
                {`${item.weight} Kg`}
              </Text>
              {!realWeight?.ideal && (
                <>
                <View  row centerV>
                  <Icon
                    name={realWeight?.down ? "triangle-down" : "triangle-up"}
                    color="red"
                    size={25}
                  />
                  <Text text90B color="red">
                    {`+ ${deviationPercentage.toFixed(2)}%`}
                  </Text>
                  </View>
                </>
              )}
            </View>
          </View>
          <View style={{ alignSelf: "flex-end" }}>
            <Text>+ info</Text>
          </View>
        </Section>
        <View style={[styles.elevation, { height: 165 }]}>
          <Text text80BL color="gray">
            NUTRICIÓN
          </Text>
          <Text>PRÓXIMAMENTE...</Text>
        </View>
      </View>
      <View marginT-10>
        <View style={[styles.elevation, { height: 165 }]}>
          <Text text80BL color="gray">
            ACTIVIDAD
          </Text>
          <Text>PRÓXIMAMENTE...</Text>
        </View>
      </View>
    </View>
  );
};

export default RenderSections;

const styles = StyleSheet.create({
  elevation: {
    borderRadius: 10,
    backgroundColor: "#fff",
    width: "45%",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
});
