import { View, Text, AnimatedImage } from "react-native-ui-lib";
import React from "react";

const HeaderInfoPet: React.FC<HeaderInfoPetProps> = ({ pet }) => {
  const rawGender = pet?.pet_breed?.life_stages?.[0]?.gender;
  const petGender =
    rawGender === "male"
      ? "Macho"
      : rawGender === "female"
      ? "Hembra"
      : "Sin especificar";
  return (
    <View row gap-10 centerV>
      <AnimatedImage
        source={{
          uri: pet?.picture,
        }}
        style={{ width: 40, height: 40 }}
        borderRadius={50}
        resizeMode="cover"
      />
      <View>
        <Text text80BO>{pet?.name}</Text>
        <View row>
          <Text text80>
            {pet?.age > 1 ? `${pet?.age} años` : `${pet?.age} año`} |{" "}
          </Text>
          <Text text80>{petGender} |{" "}</Text>
          <Text text80>{pet?.pet_breed?.description}</Text>
        </View>
      </View>
    </View>
  );
};

export default HeaderInfoPet;
