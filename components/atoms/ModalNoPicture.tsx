import { View, Text, Modal, TouchableOpacity } from "react-native-ui-lib";
import React from "react";
import { ModalNoPictureProps } from "./types";
import { Colors } from "../../styles/Colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
const ModalNoPicture: React.FC<ModalNoPictureProps> = ({
  visible,
  onRequestClose,
  picture,
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
            <TouchableOpacity onPress={()=>onRequestClose()} padding-10>
              <MaterialIcons name="close" size={20} color={"white"} />
            </TouchableOpacity>
          </View>
          <View marginT-15 center>
            <Text text50BO white>
              ¡NO HAY NINGÚNA IMAGEN!
            </Text>
            <Text text60BO white marginT-60 center>
              Te invitamos a subir la imagen de {picture}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalNoPicture;
