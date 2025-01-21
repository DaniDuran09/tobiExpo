import React, { useState } from "react";
import { View, Text } from "react-native-ui-lib";
import ChallengeModal from "../../../components/ChallengeModal";
import Recomendation from "../../../components/Recomendation";
import Dog from "../../../assets/images/dog-image.png";
import Cat from "../../../assets/images/cat-image.png";


const Welfare = (pet:any) => {
  const [challengeVisible, setChallengeVisible] = useState(false);
  const closeModalChallenge = () => setChallengeVisible(false);
  return (
    <View flex padding-10 marginT-10>
      <Text text65BO marginB-15>
        ¿Con qué frecuencia debo bañar y asear a mi mascota?
      </Text>
      <Text text70L>
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
