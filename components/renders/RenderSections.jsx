import { StyleSheet } from "react-native";
import React from "react";
import momentTZ from "../../utils/moment";
import { AnimatedImage, LoaderScreen, Text, View } from "react-native-ui-lib";
import Section from "../pet/Section";
import { Colors } from "../../styles/Colors";
import { calculateIdealWeight } from "../../utils/scripts";
import Icon from "react-native-vector-icons/Entypo";

const RenderSections = ({ item }) => {
  const calculateRemainingDays = (serviceDate, today) => {
    const daysDifference = Math.ceil(serviceDate.diff(today, "hours") / 24);

    if (daysDifference < 0) return { text: "---", color: "black" };
    else if (daysDifference === 0)
      return { text: "La cita es hoy", color: "green" };
    else
      return {
        text: `${daysDifference} ${daysDifference !== 1 ? "días" : "día"}`,
        color: "green",
      };
  };

  const getServiceDateInfo = (serviceDate) =>
    momentTZ(serviceDate).utc().format("DD.MMM");

  const getServiceStatus = (item) => {
    // if (!(item.status === "actived" && item?.service_date))
    if (!(item?.service_date))
      return { service: "---", remainingDays: { text: "---", color: "green" } };
    const serviceDate = momentTZ(item?.service_date, "YYYY-MM-DDTHH:mm:ssZ")
      .tz("America/Mexico_City")
      .startOf("day");
    const today = momentTZ().tz("America/Mexico_City").startOf("day");

    const remainingDays = calculateRemainingDays(serviceDate, today);
    const service =
      remainingDays.text !== "---"
        ? getServiceDateInfo(item?.service_date)
        : "---";

    return { service, remainingDays };
  };

  const rangeOne = item?.weight_status?.ideal_weight?.from / 1000;
  const rangeTwo = item?.weight_status?.ideal_weight?.to / 1000;
  const realWeight = calculateIdealWeight(
    rangeOne,
    rangeTwo,
    item?.weight_status?.weight
  );

  const { service, remainingDays } = getServiceStatus(item);

  return (
    <View marginB-25>
      <View row centerV gap-10 marginB-10>
        <AnimatedImage
          source={{ uri: item?.picture }}
          style={{ height: 35, width: 35, borderRadius: 32 }}
          loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
          animationDuration={500}
        />
        <Text text70BO marginL-10>
          {item.name}
        </Text>
      </View>
      <View row spread>
        <Section
          item={item}
          tabIndex={0}
          children={
            <>
              <Text text70BL>SALUD</Text>
              <Text text90M>Próxima visita</Text>
              <Text text80BL>{service}</Text>
              <Text text90MM>Faltan</Text>
              <Text color={remainingDays.color} text80BO>
                {remainingDays.text}
              </Text>
              <View alignSelf="flex-end">
                <Text>+ info</Text>
              </View>
            </>
          }
        />

        <Section
          item={item}
          tabIndex={1}
          children={
            <>
              <Text text70BL>BIENESTAR</Text>
              <Text text90M>Recomendación</Text>
              <Text text80BL>---</Text>
              <View alignSelf="flex-end">
                <Text>+ info</Text>
              </View>
            </>
          }
        />
      </View>
      <View row spread marginT-10>
        <Section
          item={item}
          tabIndex={2}
          children={
            <>
              <Text text70BL>PESO</Text>

              <View row  >
                <View centerH>
                  <Text text90M>De</Text>
                  <Text text80BO>{`${rangeOne} Kg`}</Text>
                </View>
                <View width={20} />
                <View centerH>
                  <Text text90M>A</Text>
                  <Text text80BO>{`${rangeTwo} Kg`}</Text>
                </View>
              </View>

              <Text text90M>Real</Text>
              <View row spread centerV>
                <Text
                  color={"red"}
                  text80BO
                  style={realWeight?.ideal && { color: Colors.green }}
                >{`${item.weight} Kg`}</Text>
              </View>
              {!realWeight?.ideal && (
                  <Icon
                    name={realWeight?.down ? "triangle-down" : "triangle-up"}
                    color="red"
                    size={25}
                  />
                )}

              <View alignSelf="flex-end">
                <Text>+ info</Text>
              </View>
            </>
          }
        />


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
    height: "90%",
    width: "45%",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    backgroundColor: Colors.lightGray,
  },
});
