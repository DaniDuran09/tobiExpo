import { View, Text, Modal, TouchableOpacity } from "react-native-ui-lib";
import React from "react";
import { ModalWeightInfoProps } from "./types";
import { Colors } from "../../styles/Colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ModalWeightInfo: React.FC<ModalWeightInfoProps> = ({
  visible,
  onRequestClose,
  idealWeight,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',}}>
        <View style={{backgroundColor:Colors.primaryColor}} br30 height={"30%"} width={"90%"} padding-15>
          <View row spread right>
            <TouchableOpacity onPress={onRequestClose} padding-10>
              <MaterialIcons name="close" size={20} color={"black"} />
            </TouchableOpacity>
          </View>
          <View marginT-15 center>
            <Text text60BO white>
              {idealWeight?"✅Peso en rango":"⚠️ Peso fuera de rango"}
            </Text>
            <Text text70BO white marginT-60 center>
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
