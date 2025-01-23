import React, { useEffect, useState, useCallback, useRef } from "react";
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
import { useNavigation } from "@react-navigation/native";

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

  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

  const [challengeModalText, setChallengeModalText] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [vaccinesCompleted, setVaccinesCompleted] = useState(false);
  const [dewromingsCompleted, setDewromingsCompleted] = useState(false);

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

      console.log(
        "response.data.dewormers_expired: ",
        response.data.dewormers_expired
      );
      const isVaccinated = response.data.vaccines_records.length > 0;
      response.data.vaccines_expired.length == 0 && setVaccinesCompleted(true);
      response.data.dewormers_expired.length == 0 &&
        setDewromingsCompleted(true);
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
  }, [pet.id, navigation]);

  useEffect(() => {
    getVaccinesInfo();
  }, [refresh]);

  const handleNextStep = () => {
    if (redirect) closeModalChallenge();
    else
      setState((prev) => ({
        ...prev,
        deworming: true,
        challengeVisible: false,
      }));
  };

  const closeModalChallenge = () =>
    setState((prev) => ({
      ...prev,
      finishScreen: true,
      challengeVisible: false,
    }));

  const registerVaccines = () => {
    setRedirect(true);
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    setState((prev) => ({
      ...prev,
      isVaccinated: false,
      finishScreen: false,
      vaccineVisible: true,
      challengeVisible: false,
      deworming: false,
      dewormingVisible: false,
    }));
  };

  const registerDewormings = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    setState((prev) => ({
      ...prev,
      isVaccinated: false,
      finishScreen: false,
      deworming: true,
      vaccineVisible: false,
      dewormingVisible: true,
      challengeVisible: false,
    }));
  };

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
    <ScrollView ref={scrollViewRef} contentContainerStyle={styles.mainContent}>
      {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      {isVaccinated || finishScreen ? (
        <CompleteVaccinationList
          vaccinesCompleted={vaccinesCompleted}
          dewromingsCompleted={dewromingsCompleted}
          completedVaccines={completedVaccines}
          petId={pet.id}
          registerVaccines={registerVaccines}
          registerDewormings={registerDewormings}
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
              action={() => {
                setState((prev) => ({
                  ...prev,
                  finishScreen: true,
                  challengeVisible: true,
                }));
                setRefresh(true);
              }}
            />
          ) : (
            <InformationView
              image={dewormingImage}
              text={
                "La desparasitación es esencial para reducir los parásitos internos y externos de tu mascota. Completa el registro para darle seguimiento."
              }
              type="desparasitación"
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
