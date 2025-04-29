import { View, Text, Modal, TouchableOpacity } from "react-native-ui-lib";
import React from "react";
import { ModalWeightInfoProps } from "./types";
import { Colors } from "../../styles/Colors";
import { MaterialIcons } from "react-native-vector-icons";
const ModalWeightInfo: React.FC<ModalWeightInfoProps> = ({
  visible,
  onRequestClose,
  idealWeight,
}) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      overlayBackgroundColor={Colors.primaryColor}
    >
      <View flex center>
        <View bg-white br30 height={"50%"} width={"90%"} padding-15>
          <View row spread>
            <View />
            <TouchableOpacity onPress={onRequestClose} padding-10>
              <MaterialIcons name="close" size={20} color={"black"} />
            </TouchableOpacity>
          </View>
          <View marginT-15 center>
            <Text text60BO color={Colors.primaryColor}>
              ✅ ¡Peso registrado!
            </Text>
            <Text text70BO color={Colors.primaryColor} marginT-60 center>
              {idealWeight
                ? "¡Todo en orden! Su peso es el ideal. Sigamos cuidando juntos."
                : "Está fuera del peso ideal. Nada grave, pero una visita al veterinario puede ayudarte a saber qué hacer."}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalWeightInfo;
