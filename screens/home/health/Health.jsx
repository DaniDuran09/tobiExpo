import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Colors } from "../../../styles/Colors";
import SelectVaccines from "./SelectVaccines";
import InformationView from "./InformationView";
import vaccineImage from "../../../assets/vet-option1.png";
import dewormingImage from "../../../assets/vet-option2.png";
import ChallengeModal from "../../../components/ChallengeModal";
import ApiFetcher from "../../../modules/ApiFetcher";
import Toast from "react-native-toast-message";
import CompleteVaccinationList from "../../../components/vaccines/CompleteVaccinationList";
import Loading from "../../../components/Loading";
import SelectDeworming from "./SelectDeworming";

const Health = ({ pet }) => {
  const [state, setState] = useState({
    vaccineVisible: false,
    deworming: false,
    dewormingVisible: false,
    loading: true,
    challengeVisible: false,
    finishScreen: false,
    isVaccinated: false,
    completedVaccines: [],
  });

  const [challengeModalText, setChallengeModalText] = useState("");

  const apiFetcher = new ApiFetcher();

  const getVaccinesInfo = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await apiFetcher.getVaccinesRecords(pet.id);
      if (response.data.vaccines_expired.length > 0)
        setChallengeModalText(
          "Sabemos que a veces se olvidan algunas cosas, nosotros te ayudamos a completar el esquema de salud de tu mascota."
        );
      else
        setChallengeModalText(
          "¡Muy bien! El esquema de salud de tu mascota está completo."
        );
      const isVaccinated = response.data.vaccines_records.length > 0;
      setState((prev) => ({
        ...prev,
        isVaccinated,
        completedVaccines: isVaccinated ? response.data : [],
      }));
    } catch (error) {
      console.error("Error al verificar las vacunas: ", error);
      Toast.show({
        type: "error",
        text1: "Error al conseguir la información",
        text2: "Intente de nuevo más tarde",
      });
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [pet.id]);

  useEffect(() => {
    getVaccinesInfo();
  }, [getVaccinesInfo]);

  const handleNextStep = () =>
    setState((prev) => ({ ...prev, deworming: true, challengeVisible: false }));

  const closeModalChallenge = () =>
    setState((prev) => ({
      ...prev,
      finishScreen: true,
      challengeVisible: false,
    }));

  const {
    vaccineVisible,
    deworming,
    dewormingVisible,
    loading,
    challengeVisible,
    finishScreen,
    isVaccinated,
    completedVaccines,
  } = state;

  return (
    <ScrollView contentContainerStyle={styles.mainContent}>
      {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      {isVaccinated || finishScreen ? (
        <CompleteVaccinationList
          completedVaccines={completedVaccines}
          petId={pet.id}
        />
      ) : (
        <View style={styles.container}>
          {!deworming ? (
            vaccineVisible ? (
              <SelectVaccines petId={pet.id} onSaveVaccines={handleNextStep} />
            ) : (
              <InformationView
                image={vaccineImage}
                text={
                  "Te ayudamos a tener tu mascota sana. Completa el esquema de salud para darle seguimiento."
                }
                type="vacunas"
                changeVisible={(visible) =>
                  setState((prev) => ({ ...prev, vaccineVisible: visible }))
                }
              />
            )
          ) : dewormingVisible ? (
            <SelectDeworming
              petId={pet.id}
              action={() =>
                setState((prev) => ({
                  ...prev,
                  finishScreen: true,
                  challengeVisible: true,
                }))
              }
            />
          ) : (
            <InformationView
              image={dewormingImage}
              text={
                "La desparasitación es esencial para reducir los parásitos internos y externos de tu mascota. Completa el registro para darle seguimiento."
              }
              type="desparacitación"
              changeVisible={(visible) =>
                setState((prev) => ({ ...prev, dewormingVisible: visible }))
              }
            />
          )}
          <ChallengeModal
            closeModalChallenge={closeModalChallenge}
            challengeVisible={challengeVisible}
            text={challengeModalText}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default Health;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mainContent: {
    flexGrow: 1,
    padding: 5,
  },
});
