import {StyleSheet } from "react-native";
import React, { useState } from "react";
import ChallengeModal from "../../../components/ChallengeModal";
import Recomendation from "../../../components/Recomendation";
import { View,Text } from "react-native-ui-lib";

const Welfare = () => {
  const [challengeVisible, setChallengeVisible] = useState(false);
  const closeModalChallenge = () => {
    console.log("Me presiono")
    setChallengeVisible(false);
  };
  return (
    <View flex padding-10 style={styles.container}>
      <Text text65BO marginB-15>
        ¿Con qué frecuencia debo bañar y asear a mi mascota?
      </Text>
      <Text text70L>
        Para que tu mascota esté sana, felíz y limpia, considera por lo menos
        una vez por mes.
      </Text>
      <Recomendation
            title={"GROOMING, SPA Y ESTÉTICA"}
            info={
              "¿Quieres programar un baño/aseo para tu mascota?"
            }
            setVisible={setChallengeVisible}
          />
      <ChallengeModal
        closeModalChallenge={closeModalChallenge}
        challengeVisible={challengeVisible}
        text={"En los días sin baño mantén el deslanado para evitar la formación de nudos."}
      />
    </View>
  );
};

export default Welfare;

const styles = StyleSheet.create({
  container: {   
    marginTop: "8%",
  }, 
});
