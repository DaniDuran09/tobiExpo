import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../../styles/Colors";
import ChallengeModal from "../../../components/ChallengeModal";
import Recomendation from "../../../components/Recomendation";
import Dog from "../../../assets/images/dog-image.png";
import Cat from "../../../assets/images/cat-image.png";

const Welfare = ({ pet }) => {
  const [challengeVisible, setChallengeVisible] = useState(false);
  const closeModalChallenge = () => {
    setChallengeVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ¿Con qué frecuencia debo bañar y asear a mi mascota?
      </Text>
      <Text style={styles.text}>
        {pet?.pet_breed?.type_pet?.value == "cat"
          ? "Para que tu mascota esté sana, felíz y limpia, considera por lo menos una vez cada dos meses."
          : "Para que tu mascota esté sana, felíz y limpia, considera por lo menos una vez por mes."}
      </Text>
      <Recomendation
        image={pet?.pet_breed?.type_pet?.value == "cat" ? Cat : Dog}
        title={"GROOMING, SPA Y ESTÉTICA"}
        info={"¿Quieres programar un baño/aseo para tu mascota?"}
        setVisible={setChallengeVisible}
      />
      <ChallengeModal
        closeModalChallenge={closeModalChallenge}
        challengeVisible={challengeVisible}
        text={
          pet?.pet_breed?.type_pet?.value == "cat"
            ? "Aunque a los gatitos no les guste el agua, ¡también se bañan!"
            : "En los días sin baño mantén el deslanado para evitar la formación de nudos."
        }
      />
    </View>
  );
};

export default Welfare;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "8%",
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    fontWeight: "300",
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
