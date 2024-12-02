import { Image, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Colors } from "../../../styles/Colors";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Recomendation from "../../../components/Recomendation";
import ChallengeModal from "../../../components/ChallengeModal";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { calculateIdealWeight } from "../../../utils/scripts";
import CorrectWeight from "../../../components/pet/CorrectWeight";
import ApiFetcher from "../../../modules/ApiFetcher";
import Loading from "../../../components/Loading";

const Weight = (props) => {
  const { item } = props;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pet, setPet] = useState({});
  const navigation = useNavigation();
  const [challengeVisible, setChallengeVisible] = useState();

  const apiFetcher = new ApiFetcher();

  const closeModalChallenge = () => {
    setChallengeVisible(false);
  };

  const rangeOne = pet?.ideal_weight?.from / 1000;
  const rangeTwo = pet?.ideal_weight?.to / 1000;

  const realWeight = calculateIdealWeight(rangeOne, rangeTwo, parseInt(pet?.weight));

  const getPet = async () => {
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
    setSuccess(realWeight?.ideal);
  }, [pet]);

  return (
    <ScrollView>
      <View style={styles.container}>
      {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
        <View style={styles.realWeightContainer}>
          <View style={styles.statusContainer}>
            <Image
              source={require("../../../assets/balance.png")}
              style={styles.imageBalance}
            />
            <Text style={styles.realText}>Real</Text>
          </View>
          <Text
            style={[styles.kgText, realWeight?.ideal && { color: Colors.green }]}
          >
            {parseInt(pet.weight)} kg
          </Text>
          <Text style={styles.lastUpdate}>Último registro: {pet.weight_updated_at ? pet.weight_updated_at : "Sin fecha"}</Text>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() =>
              navigation.navigate("EditPet", {
                id: item.id,
              })
            }
          >
            <Text style={styles.updateTetx}>Actualizar peso real</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.realWeightContainer}>
          <View style={styles.statusContainer}>
            <Image
              source={require("../../../assets/balance.png")}
              style={styles.imageBalance}
            />
            <Text style={styles.realText}>Rango ideal</Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: "black",
              fontWeight: "bold",
              marginTop: 10,
            }}
          >{`${rangeOne} Kg - ${rangeTwo} Kg`}</Text>
        </View>
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
    </ScrollView>
  );
};

export default Weight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  realWeightContainer: {
    backgroundColor: Colors.mediumWhite,
    padding: 15,
    borderRadius: 8,
    marginBottom: "5%",
  },
  imageBalance: {
    width: 20,
    height: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  realText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "600",
  },
  kgText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primaryColor,
  },
  lastUpdate: {
    marginTop: 25,
    fontWeight: "300",
  },
  updateButton: {
    marginTop: 10,
  },
  updateTetx: {
    textDecorationLine: "underline",
    fontWeight: "500",
  },
  textWeight: {
    marginTop: 25,
    color: Colors.primaryColor,
    marginLeft: 10,
  },
  triangleContianer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  weightPoints: {
    marginLeft: 3,
    color: Colors.primaryColor,
  },
  containerInfo: {
    marginTop: 15,
    backgroundColor: Colors.pink,
    padding: 20,
    borderRadius: 8,
    flexDirection: "row",
    gap: 15,
  },
  image: {
    width: 140,
    height: 180,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  info: {
    fontSize: 16,
    marginTop: 12,
    color: Colors.primaryColor,
  },
  priceContainer: {
    borderWidth: 0.8,
    borderColor: Colors.primaryColor,
    marginTop: 12,
    borderRadius: 4,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  infoPrice: {
    color: Colors.primaryColor,
  },
  button: {
    marginTop: 12,
  },
  textButton: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
  containerLetters: {
    width: "50%",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
});
