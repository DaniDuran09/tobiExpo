import React, { useEffect, useState } from "react";
import momentTZ from "../../utils/moment";
import { AnimatedImage, LoaderScreen, Text, View, Button } from "react-native-ui-lib";
import Section from "../pet/Section";
import { Colors } from "../../styles/Colors";
import { calculateIdealWeight } from "../../utils/scripts";
import Icon from "react-native-vector-icons/Entypo";
import { useGetVaccinationRecordsQuery } from "../../services/api/health.api";
import NoHealthRecord from "../atoms/NoHealthRecord";
import ActionModal from "../atoms/ActionModal";
import { useNavigation } from "@react-navigation/native";

const RenderSections = ({ item }) => {
  const navigation = useNavigation();

  const navigateToService = (query) => {
    navigation.navigate("Explore", {
      screen: "SelectService",
      params: { q: query },
    });
  };

  const {
    data: vaccinesResponse,
    refetch: refetchVaccines,
    isLoading: isLoadingVaccines,
  } = useGetVaccinationRecordsQuery(item.id);
  const vaccines = vaccinesResponse?.data || [];

  const [vaccineState, setVaccineState] = useState({ present: false, name: '', days: null, isExpired: false, cannotCalc: false, hasAppointment: false });
  const [dewormerState, setDewormerState] = useState({ present: false, name: '', days: null, isExpired: false, cannotCalc: false, hasAppointment: false });

  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionModalContent, setActionModalContent] = useState({
    title: "",
    bullets: [],
    summaryText: "",
    footerText: "",
    query: "",
  });

  useEffect(() => {
    refetchVaccines();
  }, []);

  const vaccinesData = vaccinesResponse?.data;

  useEffect(() => {
    if (vaccinesData) {
      // VACCINES LOGIC
      const validRecords = vaccinesData.vaccines_records || [];
      const hasRecords = validRecords.length > 0;

      const isVaccineApplied = (v) => {
        if (v.applied || v.application_day) return true;
        if (!validRecords.length) return false;
        const vName = v.name || v.vaccine_name || v.brand || '';
        const lowerName = vName.trim().toLowerCase();
        return validRecords.some(rec => {
          const rName = rec.name || rec.vaccine_name || rec.brand || '';
          return rName.trim().toLowerCase() === lowerName;
        });
      };

      const actualExpired = (vaccinesData.vaccines_expired || []).filter(isVaccineApplied);
      const actualToExpire = (vaccinesData.vaccines_toexpire || []).filter(isVaccineApplied);

      const hasExpired = actualExpired.length > 0;
      const hasToExpire = actualToExpire.length > 0;

      const vPresent = hasRecords || actualExpired.some(v => v.applied || v.application_day);
      let vName = '';
      let vDays = null;
      let vIsExpired = false;
      let vCannotCalc = false;

      let vHasAppt = false;

      if (vPresent) {
        if (hasExpired) {
          vIsExpired = true;
          const firstExp = actualExpired[0];
          vName = firstExp.name || firstExp.vaccine_name || firstExp.brand || 'Vacuna';
          vHasAppt = !!firstExp.has_existing_appointment;
        } else if (hasToExpire) {
          const sortedToExpire = [...actualToExpire].sort((a, b) => a.days_remaining - b.days_remaining);
          const nextV = sortedToExpire[0];
          vName = nextV.name || nextV.vaccine_name || nextV.brand || 'Vacuna';
          vDays = nextV.days_remaining;
          vHasAppt = !!nextV.has_existing_appointment;
          if (vDays <= 0) vIsExpired = true;
        } else {
          vCannotCalc = true;
          if (hasRecords) {
            const lastRec = validRecords[validRecords.length - 1];
            vName = lastRec.name || lastRec.vaccine_name || lastRec.brand || 'Vacuna';
          }
        }
      }
      setVaccineState({ present: vPresent, name: vName, days: vDays, isExpired: vIsExpired, cannotCalc: vCannotCalc, hasAppointment: vHasAppt });

      // DEWORMERS LOGIC
      const validDewormers = vaccinesData.dewormers_records || [];
      const hasDewormerRecords = validDewormers.length > 0;

      const isDewormerApplied = (d) => {
        if (d.applied || d.application_day) return true;
        if (!validDewormers.length) return false;
        const dName = (d.deworming_type || d.description || d.name || d.brand || '').replace("Desparasitación ", "").trim().toLowerCase();
        return validDewormers.some(rec => {
          const rName = (rec.deworming_type || rec.description || rec.name || rec.brand || '').replace("Desparasitación ", "").trim().toLowerCase();
          return rName.trim().toLowerCase() === dName;
        });
      };

      const actualDewormersExpired = (vaccinesData.dewormers_expired || vaccinesData.expired_dewormers || []).filter(isDewormerApplied);
      const actualDewormersToExpire = (vaccinesData.dewormers_toexpire || vaccinesData.toexpire_dewormers || []).filter(isDewormerApplied);

      const hasDewormersExpired = actualDewormersExpired.length > 0;
      const hasDewormersToExpire = actualDewormersToExpire.length > 0;

      const dPresent = hasDewormerRecords || actualDewormersExpired.some(d => d.applied || d.application_day);
      let dName = '';
      let dDays = null;
      let dIsExpired = false;
      let dCannotCalc = false;

      let dHasAppt = false;

      if (dPresent) {
        if (hasDewormersExpired) {
          dIsExpired = true;
          const firstExp = actualDewormersExpired[0];
          dName = firstExp.deworming_type || firstExp.description || firstExp.name || firstExp.brand || 'Desparasitante';
          dHasAppt = !!firstExp.has_existing_appointment;
        } else if (hasDewormersToExpire) {
          const sortedToExpire = [...actualDewormersToExpire].sort((a, b) => a.days_remaining - b.days_remaining);
          const nextD = sortedToExpire[0];
          dName = nextD.deworming_type || nextD.description || nextD.name || nextD.brand || 'Desparasitante';
          dDays = nextD.days_remaining;
          dHasAppt = !!nextD.has_existing_appointment;
          if (dDays <= 0) dIsExpired = true;
        } else {
          dCannotCalc = true;
          if (hasDewormerRecords) {
            const lastRec = validDewormers[validDewormers.length - 1];
            dName = lastRec.deworming_type || lastRec.description || lastRec.name || lastRec.brand || 'Desparasitante';
          }
        }
      }

      setDewormerState({ present: dPresent, name: dName, days: dDays, isExpired: dIsExpired, cannotCalc: dCannotCalc, hasAppointment: dHasAppt });
    }
  }, [vaccinesData]);

  const renderStatus = (stateObj) => {
    let color = "orange";
    let text = `${stateObj.days} días`;

    if (stateObj.cannotCalc) {
      color = "orange";
      text = "No hemos podido calcular el tiempo que falta";
    } else if (stateObj.isExpired || (stateObj.days !== null && stateObj.days <= 0)) {
      color = "red";
      text = "Vencida";
    } else if (stateObj.days > 50) {
      color = Colors.green;
      text = "Aún falta. Te avisaremos cuando se acerque la fecha";
    } else if (stateObj.days >= 31 && stateObj.days <= 50) {
      color = Colors.green;
      text = `${stateObj.days} días`;
    }

    return (
      <Text text90M color={color}>
        {text}
      </Text>
    );
  };

  const rangeOne = item?.weight_status?.ideal_weight?.from / 1000;
  const rangeTwo = item?.weight_status?.ideal_weight?.to / 1000;
  const realWeight = calculateIdealWeight(
    rangeOne,
    rangeTwo,
    item?.weight_status?.weight
  );

  const openVaccineModal = () => {
    if (vaccineState.isExpired) {
      setActionModalContent({
        title: "Esta vacuna está vencida",
        bullets: [
          "Puede quedar expuesto a enfermedades.",
          "Su protección puede disminuir.",
          "Puede afectar su sistema inmune."
        ],
        summaryText: "Vacunar a tiempo es clave para mantenerlo protegido.",
        footerText: "Un veterinario puede ayudarte a actualizar su esquema.",
        query: vaccineState.name,
      });
    } else {
      setActionModalContent({
        title: "Esta vacuna está por vencer",
        bullets: [
          "Ayuda a mantener su protección activa.",
          "Evita retrasos en su esquema.",
          "Previene enfermedades."
        ],
        summaryText: "Agendar a tiempo ayuda a evitar riesgos.",
        footerText: "Mantener su esquema al día es clave para su salud.",
        query: vaccineState.name,
      });
    }
    setActionModalVisible(true);
  };

  const openDewormerModal = () => {
    if (dewormerState.isExpired) {
      setActionModalContent({
        title: "La desparasitación está vencida",
        bullets: [
          "Puede estar expuesto a parásitos.",
          "Puede afectar su digestión y energía.",
          "Puede contagiar a otros animales."
        ],
        summaryText: "Atenderlo a tiempo ayuda a evitar problemas de salud.",
        footerText: "Un veterinario puede indicarte el tratamiento adecuado.",
        query: dewormerState.name,
      });
    } else {
      setActionModalContent({
        title: "La desparasitación está por vencer",
        bullets: [
          "Puede quedar expuesto a parásitos si se atrasa.",
          "Puede afectar su digestión y energía.",
          "Puede contagiar a otros animales."
        ],
        summaryText: "Hacerlo a tiempo ayuda a evitar problemas.",
        footerText: "Mantenerlo al día es clave para su bienestar.",
        query: dewormerState.name,
      });
    }
    setActionModalVisible(true);
  };

  const openWeightModal = () => {
    if (realWeight?.down) {
      setActionModalContent({
        title: "Tu mascota podría tener bajo peso",
        bullets: [
          "Puede indicar deficiencias nutricionales.",
          "Puede debilitar su sistema inmune.",
          "Reduce su energía."
        ],
        summaryText: "Detectarlo a tiempo puede evitar complicaciones.",
        footerText: "Un veterinario puede ayudarte a encontrar la causa.",
        query: "Consulta",
      });
    } else {
      setActionModalContent({
        title: "Tu mascota podría tener sobrepeso",
        bullets: [
          "Puede aumentar el riesgo de enfermedades cardiacas.",
          "Puede afectar sus articulaciones.",
          "Reduce su energía y movilidad."
        ],
        summaryText: "Atenderlo a tiempo puede mejorar su calidad de vida.",
        footerText: "Un veterinario puede ayudarte a definir un plan adecuado.",
        query: "Consulta",
      });
    }
    setActionModalVisible(true);
  };

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
          haveItem={vaccineState.present}
          children={
            <>
              {vaccineState.present ? (
                (!vaccineState.isExpired && (vaccineState.days === null || vaccineState.days > 50)) ? (
                  <>
                    <Text text70BL adjustsFontSizeToFit numberOfLines={1} uppercase>
                      Vacunas
                    </Text>
                    <View flex centerV centerH marginT-15 padding-10>
                      <Text text80BO color={Colors.green} center>
                        Vacunas al día. Te avisamos si algo cambia.
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Text text70BL adjustsFontSizeToFit numberOfLines={1} uppercase>
                      Vacunas
                    </Text>
                    <Text text90M>Próximos vencimientos</Text>
                    <Text text80BL>{vaccineState.name}</Text>
                    <Text text90M>Faltan</Text>
                    {renderStatus(vaccineState)}
                    {vaccineState.hasAppointment ? (
                      <View marginT-10>
                        <View row centerV>
                          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.red, marginRight: 6 }} />
                          <Text text100 color={Colors.gray} adjustsFontSizeToFit numberOfLines={1}>
                            Ya tienes una cita programada
                          </Text>
                        </View>
                        <Button
                          label="Ver cita"
                          color={Colors.white}
                          backgroundColor={Colors.primaryColor}
                          marginT-10
                          borderRadius={8}
                          size="small"
                          labelStyle={{ fontSize: 12 }}
                          style={{ width: '100%', height: 32 }}
                          onPress={() => {
                            navigation.navigate("ProfileStack", { screen: "AppointmentsHome" });
                          }}
                        />
                      </View>
                    ) : (
                      <>
                        <Text text100 marginT-10 color={Colors.gray} adjustsFontSizeToFit numberOfLines={1}>
                          Evita que pierda protección
                        </Text>
                        <Button
                          label="Agendar"
                          color={Colors.white}
                          backgroundColor={Colors.primaryColor}
                          marginT-10
                          borderRadius={8}
                          size="small"
                          labelStyle={{ fontSize: 12 }}
                          style={{ width: '100%', height: 32 }}
                          onPress={openVaccineModal}
                        />
                      </>
                    )}
                  </>
                )
              ) : (
                <NoHealthRecord
                  title="¿Ya tiene sus vacunas?"
                  description="Regístralas para no olvidar y cuidar su salud."
                  buttonText="Registrar"
                />
              )}
            </>
          }
        />

        <Section
          item={item}
          tabIndex={1}
          haveItem={dewormerState.present}
          children={
            dewormerState.present ? (
              (!dewormerState.isExpired && (dewormerState.days === null || dewormerState.days > 50)) ? (
                <>
                  <Text text70BL adjustsFontSizeToFit numberOfLines={1} uppercase>
                    Desparasitaciones
                  </Text>
                  <View flex centerV centerH marginT-15 padding-10>
                    <Text text80BO color={Colors.green} center>
                      Desparasitaciones al día. Te avisamos si algo cambia.
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <Text text70BL adjustsFontSizeToFit numberOfLines={1} uppercase>
                    Desparasitaciones
                  </Text>
                  <Text text90M>Próximos vencimientos</Text>
                  <Text text80BL>{dewormerState.name}</Text>
                  <Text text90M>Faltan</Text>
                  {renderStatus(dewormerState)}
                  {dewormerState.hasAppointment ? (
                    <View marginT-10>
                      <View row centerV>
                        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.red, marginRight: 6 }} />
                        <Text text100 color={Colors.gray} adjustsFontSizeToFit numberOfLines={1}>
                          Ya tienes una cita programada
                        </Text>
                      </View>
                      <Button
                        label="Ver cita"
                        color={Colors.white}
                        backgroundColor={Colors.primaryColor}
                        marginT-10
                        borderRadius={8}
                        size="small"
                        labelStyle={{ fontSize: 12 }}
                        style={{ width: '100%', height: 32 }}
                        onPress={() => {
                          navigation.navigate("ProfileStack", { screen: "AppointmentsHome" });
                        }}
                      />
                    </View>
                  ) : (
                    <>
                      <Text text100 marginT-10 color={Colors.gray} adjustsFontSizeToFit numberOfLines={1}>
                        Evita que aparezcan parásitos
                      </Text>
                      <Button
                        label="Agendar"
                        color={Colors.white}
                        backgroundColor={Colors.primaryColor}
                        marginT-10
                        borderRadius={8}
                        size="small"
                        labelStyle={{ fontSize: 12 }}
                        style={{ width: '100%', height: 32 }}
                        onPress={openDewormerModal}
                      />
                    </>
                  )}
                </>
              )
            ) : (
              <NoHealthRecord
                title="Dile adiós a los parásitos"
                description="Regístralas y te avisamos justo a tiempo."
                buttonText="Registrar"
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
                item.has_health_appointment ? (
                  <View marginT-10>
                    <View row centerV>
                      <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.red, marginRight: 6 }} />
                      <Text text100 color={Colors.gray} adjustsFontSizeToFit numberOfLines={1}>
                        Ya tienes una cita programada
                      </Text>
                    </View>
                    <Button
                      label="Ver cita"
                      color={Colors.white}
                      backgroundColor={Colors.primaryColor}
                      marginT-10
                      borderRadius={8}
                      size="small"
                      labelStyle={{ fontSize: 12 }}
                      style={{ width: '100%', height: 32 }}
                      onPress={() => {
                        navigation.navigate("ProfileStack", { screen: "AppointmentsHome" });
                      }}
                    />
                  </View>
                ) : (
                  <>
                    <View row centerV marginT-5>
                      <Icon
                        name={realWeight?.down ? "triangle-down" : "triangle-up"}
                        color="red"
                        size={20}
                      />
                      <Text text100 color={Colors.gray} marginL-5 style={{ flex: 1, flexWrap: 'wrap' }}>
                        Puede afectar su movilidad y salud.
                      </Text>
                    </View>
                    <Button
                      label="Agendar"
                      color={Colors.white}
                      backgroundColor={Colors.primaryColor}
                      marginT-10
                      borderRadius={8}
                      size="small"
                      labelStyle={{ fontSize: 12 }}
                      style={{ width: '100%', height: 32 }}
                      onPress={openWeightModal}
                    />
                  </>
                )
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

      <ActionModal
        visible={actionModalVisible}
        onRequestClose={() => setActionModalVisible(false)}
        onAction={() => {
          setActionModalVisible(false);
          navigateToService(actionModalContent.query);
        }}
        title={actionModalContent.title}
        bullets={actionModalContent.bullets}
        summaryText={actionModalContent.summaryText}
        footerText={actionModalContent.footerText}
      />
    </View>
  );
};

export default RenderSections;
