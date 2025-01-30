import React, { useCallback, useEffect, useState } from "react";
import { Colors } from "../../../styles/Colors";
import Recomendation from "../../../components/Recomendation";
import ChallengeModal from "../../../components/ChallengeModal";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { calculateIdealWeight } from "../../../utils/scripts";
import CorrectWeight from "../../../components/pet/CorrectWeight";
import ApiFetcher from "../../../modules/ApiFetcher";
import Loading from "../../../components/Loading";
import momentTZ from "../../../utils/moment";
import { View, Text, TouchableOpacity } from "react-native-ui-lib";
import { CardInfo } from "../../../components/pet/CardInfo";

const Weight = ({ item }: WeightProps) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pet, setPet] = useState<any>({});
  const navigation = useNavigation<any>();
  const [challengeVisible, setChallengeVisible] = useState<boolean>();

  const apiFetcher = new ApiFetcher();

  const closeModalChallenge = (): void => {
    setChallengeVisible(false);
  };

  const rangeOne = pet?.ideal_weight?.from / 1000;
  const rangeTwo = pet?.ideal_weight?.to / 1000;

  const realWeight = calculateIdealWeight(
    rangeOne,
    rangeTwo,
    parseInt(pet?.weight)
  );

  const getPet = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await apiFetcher.getPetById(item.id);
      setPet(response.data);
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getPet();
      return () => {};
    }, [navigation])
  );

  useEffect(() => {
    setSuccess(Boolean(realWeight?.ideal));
  }, [pet]);

  return (
    <View flex backgroundColor={Colors.white} padding-15>
      {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      <CardInfo title="Real" image={require("../../../assets/balance.png")}>
        <Text
          text60BO
          marginT-10
          color={realWeight?.ideal ? Colors.green : Colors.primaryColor}
        >
          {parseInt(pet.weight)} kg
        </Text>
        <Text marginT-15>
          Último registro:{" "}
          {pet.weight_updated_at
            ? momentTZ(pet.weight_updated_at).format("D MMM YY")
            : "Sin fecha"}
        </Text>

        <TouchableOpacity
          marginT-10
          onPress={() =>
            navigation.navigate("EditPet", {
              id: item.id,
            })
          }
        >
          <Text text80M underline>
            Actualizar peso real
          </Text>
        </TouchableOpacity>
      </CardInfo>

      <CardInfo
        title="Rango ideal"
        image={require("../../../assets/balance.png")}
      >
        <Text text80BO marginT-10>{`${rangeOne} Kg - ${rangeTwo} Kg`}</Text>
      </CardInfo>

      {success ? (
        <CorrectWeight />
      ) : (
        <Recomendation
          title={"Recomendación"}
          info={
            "Programa una cita con un especialista en nutrición para el cuidado de tu mascota."
          }
          setVisible={setChallengeVisible}
          oneOption={true}
        />
      )}
      <ChallengeModal
        closeModalChallenge={closeModalChallenge}
        challengeVisible={challengeVisible}
        text={
          "El bienestar de tu mascota es lo más importante. Consulta a un especialista para asegurarte de que esté en el rango ideal."
        }
      />
    </View>
  );
};

export default Weight;
