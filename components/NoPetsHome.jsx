import { StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, gradientColors } from "../styles/Colors";
import NoPets from "./NoPets";
import { Text, View } from "react-native-ui-lib";
import Section from "./pet/Section";

const NoPetsHome = () => {
  return (
    <View flex center>
      <NoPets />
      <Text style={styles.secondaryText}>
        Agregue y actualice los detalles de su mascota
      </Text>
      <View
        row
        width={"100%"}
        spread
        paddingH-15
        style={{
          shadowColor: "#000000",
          shadowOpacity: 0.8,
          shadowRadius: 2,
          shadowOffset: {
            height: 1,
            width: 1,
          },
        }}
      >
        <Section
          disabled={true}
          tabIndex={0}
          children={
            <>
              <Text text70BL>Vacunas</Text>
              <Text text90M>Próximos vencimientos</Text>
              {/* <Text text80BL>{service}</Text> */}
              <Text text90MM>Faltan</Text>
              {/* <Text color={remainingDays.color} text80BO>
                {remainingDays.text}
              </Text> */}
              <View alignSelf="flex-end">
                <Text>+ info</Text>
              </View>
            </>
          }
        />

        <Section
          disabled={true}
          tabIndex={1}
          children={
            <>
              <Text text70BL>Desparacitación</Text>
              <Text text90M>Próximos vencimientos</Text>
              <Text text90MM>Faltan</Text>
              <View alignSelf="flex-end">
                <Text>+ info</Text>
              </View>
            </>
          }
        />
      </View>
      <View
        row
        spread
        marginT-10
        paddingH-5
        style={{
          shadowColor: "#000000",
          shadowOpacity: 0.8,
          shadowRadius: 2,
          shadowOffset: {
            height: 1,
            width: 1,
          },
        }}
      >
        <Section
          disabled={true}
          children={
            <>
              <Text text70BL>PESO</Text>
              <View marginV-5>
                <Text text90M>Rango ideal</Text>
                <Text text80BO>{`--- Kg - --- Kg`}</Text>
              </View>
              <Text text90M>Real</Text>
              <View row spread centerV>
                <Text color={"red"} text80BO>
                  {" "}
                  --- Kg
                </Text>
              </View>
              <View alignSelf="flex-end">
                <Text>+ info</Text>
              </View>
            </>
          }
        />
        <View width={"50%"} />
      </View>
    </View>
  );
};

export default NoPetsHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  secondaryText: {
    marginTop: "3%",
    fontWeight: "300",
    paddingBottom: "5%",
    width: "110%",
    textAlign: "center",
    backgroundColor: Colors.white,
  },
  blockTitle: {
    fontSize: 14,
    color: "grey",
    fontWeight: "bold",
  },
  blockContainer: {
    marginTop: "5%",
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    gap: 20,
    width: "100%",
    height: 200,
    opacity: 0.5,
  },
  block: {
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    height: "100%",
    width: "45%",
    paddingHorizontal: 10,
    paddingTop: "4%",
    backgroundColor: Colors.lightGray,
  },
  blockText: {
    fontSize: 12,
    color: "black",
    fontWeight: "400",
    marginTop: "5%",
  },
  noPetsContainer: {
    marginTop: "5%",
    alignItems: "center",
    height: "40%",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    backgroundColor: Colors.white,
  },
});
