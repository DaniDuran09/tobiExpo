import React from "react";
import NoPets from "./NoPets";
import { Text, View } from "react-native-ui-lib";
import Section from "./pet/Section";

const NoPetsHome = ({ onPress }) => {
  return (
    <View flex centerH>
      <NoPets onPress={onPress} />
      <Text marginV-20>Agregue y actualice los detalles de su mascota</Text>
      <View
        row
        width={"100%"}
        spread
        paddingH-15
        style={{
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 5,
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
              <Text text70BL>Desparasitación</Text>
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
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 2,
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
