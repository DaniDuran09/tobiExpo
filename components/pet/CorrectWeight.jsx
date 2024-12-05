import React from "react";
import { Text, View } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../../styles/Colors";

const CorrectWeight = () => {
  return (
    <View br20 padding-15 style={{ borderWidth: 1, borderColor: Colors.green }} marginT-15>
      <View row gap-10>
        <Icon name="thumb-up-outline" size={20} color={Colors.green} />
        <View>
          <Text text70BO>¡Bien hecho!</Text>
          <Text text70>Tu mascota está dentro del rango de su peso ideal. </Text>
        </View>
      </View>
    </View>
  );
}

export default CorrectWeight;
