import React, { useEffect, useState } from "react";
import momentTZ from "../../utils/moment";
import { AnimatedImage, LoaderScreen, Text, View } from "react-native-ui-lib";
import Section from "../pet/Section";
import { Colors } from "../../styles/Colors";
import { calculateIdealWeight } from "../../utils/scripts";
import Icon from "react-native-vector-icons/Entypo";
import { useGetVaccinationRecordsQuery } from "../../services/api/health.api";
import NoHealthRecord from "../atoms/NoHealthRecord";
import ModalWeightInfo from "../atoms/ModalWeightInfo";

const RenderSections = ({ item }) => {
  const {
    data: vaccinesResponse,
    refetch: refetchVaccines,
    isLoading: isLoadingVaccines,
  } = useGetVaccinationRecordsQuery(item.id);
  const vaccines = vaccinesResponse?.data || [];

  const [lowestDaysRemaining, setLowestDaysRemaining] = useState(null);
  const [haveAnyVaccine, setHaveAnyVaccine] = useState(false);
  const [nameVaccine, setNameVaccine] = useState('');
  const [haveAnyDewormers, setHaveAnyDewormers] = useState(false);
  const [nextDewormer, setNextDewormer] = useState(null);
  const [modalWeightInfoVisible, setModalWeightInfoVisible] = useState(false);

  useEffect(() => {
    refetchVaccines();

    if (vaccines?.vaccines_records || vaccines?.vaccines_expired) {
      const vaccinesList = [
        ...(vaccines.vaccines_records || []).map((record) => {
          setHaveAnyVaccine(vaccines.vaccines_records.length > 0);
          setHaveAnyDewormers(vaccines.dewormers_records.length > 0);
          console.log("VACCINES",vaccines.dewormers_records);
          const matchingToExpire = (vaccines.vaccines_toexpire || []).find(
            (toExpire) => toExpire.id === record.id
          );
          setNameVaccine(matchingToExpire?.name || '');
          if (matchingToExpire) {
            return {
              ...record,
              days_remaining: matchingToExpire.days_remaining,
            };
          }
          return record;
        }),
        ...(vaccines.vaccines_expired || []),
      ];

      const lowestDaysRemaining = vaccinesList.reduce((lowest, vaccine) => {
        if (!vaccine.days_remaining) return lowest;
        if (!lowest || vaccine.days_remaining < lowest) {
          return vaccine.days_remaining;
        }
        return lowest;
      }, null);
      setLowestDaysRemaining(lowestDaysRemaining);
    }

    if (vaccines?.dewormers_records?.length > 0) {
  setHaveAnyDewormers(true);

  const today = momentTZ().startOf("day");

  const dewormersWithDays = vaccines.dewormers_records.map((dewormer) => {
    const nextDoseDate = momentTZ(dewormer.next_dose).startOf("day");
    const daysRemaining = nextDoseDate.diff(today, "days");
    return { ...dewormer, days_remaining: daysRemaining };
  });

  const sortedDewormers = dewormersWithDays.sort(
    (a, b) => a.days_remaining - b.days_remaining
  );

  setNextDewormer(sortedDewormers[0]);
} else {
  setHaveAnyDewormers(false);
  setNextDewormer(null);
}

  }, [vaccines]);

  const rangeOne = item?.weight_status?.ideal_weight?.from / 1000;
  const rangeTwo = item?.weight_status?.ideal_weight?.to / 1000;
  const realWeight = calculateIdealWeight(
    rangeOne,
    rangeTwo,
    item?.weight_status?.weight
  );

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
      <View
        row
        spread
        paddingH-5
        style={{
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 5,
        }}
      >
        <Section
          item={item}
          tabIndex={0}
          haveItem={haveAnyVaccine}
          children={
            <>
              {haveAnyVaccine ? (
                <>
                  <Text
                    text70BL
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    uppercase
                  >
                    Vacunas
                  </Text>
                  <Text text90M>Próximos vencimientos</Text>
                  <Text text80BL>{nameVaccine}</Text>
                  <Text text90M>Faltan</Text>
                  <Text
                    text90M
                    color={lowestDaysRemaining > 30 ? Colors.green : "orange"}
                  >
                    {lowestDaysRemaining
                      ? lowestDaysRemaining <= 50
                        ? `Faltan ${lowestDaysRemaining} días`
                        : `Aún falta. Te avisaremos cuando se acerque la fecha`
                      : "No hemos podido calcular el tiempo que falta para la próxima vacuna"}
                  </Text>
                  <View alignSelf="flex-end">
                    <Text text90M>+ info</Text>
                  </View>
                </>
              ) : (
                <NoHealthRecord
                  title="¿Ya tiene sus vacunas?"
                  description="Regístralas para no olvidar y cuidar su salud."
                  buttonText="Registrar aquí"
                />
              )}
            </>
          }
        />

        <Section
          item={item}
          tabIndex={1}
          haveItem={haveAnyDewormers}
          children={
            haveAnyDewormers && nextDewormer ? (
              <>
                <Text text70BL adjustsFontSizeToFit numberOfLines={1} uppercase>
                  Desparasitación
                </Text>
                <Text text90M>Próximos vencimientos</Text>
                <Text text80BL>{nextDewormer.brand}</Text>
                <Text text90M>Faltan</Text>
                <Text
                  text90M
                  color={nextDewormer.days_remaining > 30 ? Colors.green : "orange"}
                >
                  {nextDewormer.days_remaining > 30
                    ? `Aún falta. Te avisaremos cuando se acerque la fecha`
                    : `Faltan ${nextDewormer.days_remaining} días`}
                </Text>
                <View alignSelf="flex-end">
                  <Text text90M>+ info</Text>
                </View>
              </>
            ) : (
              <NoHealthRecord
                title="Dile adiós a los parásitos"
                description="Regístralas y te avisamos justo a tiempo."
                buttonText="Registrar aquí"
              />
            )
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
          item={item}
          tabIndex={2}
          screen="Weight"
          onPress={() => setModalWeightInfoVisible(true)}
          children={
            <>
              <Text text70BL adjustsFontSizeToFit numberOfLines={1} uppercase>
                Peso
              </Text>
              <View>
                <Text text90M>Rango ideal</Text>
                <Text text80BO>{`${rangeOne} Kg - ${rangeTwo} Kg`}</Text>
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
              {realWeight?.ideal && (
                <View row centerV>
                  <View
                    style={{
                      backgroundColor: Colors.green,
                      borderRadius: 50,
                      width: 10,
                      height: 10,
                      marginRight: 5,
                    }}
                  />
                  <Text text90 style={{ color: Colors.green }}>¡Bien hecho!</Text>
                </View>
              )}
            </>
          }
        />
      </View>
      <ModalWeightInfo
        visible={modalWeightInfoVisible}
        onRequestClose={() => setModalWeightInfoVisible(false)}
        idealWeight={realWeight?.ideal}
      />
    </View>
  );
};

export default RenderSections;
