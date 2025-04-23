import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import React from "react";
import { Platform } from "react-native";
import { Colors } from "../styles/Colors";

type DeleteModalProps = {
  visible: boolean;
  closeModal: () => void;
  deletePet: () => void;
};

const DeleteModal = ({ visible, closeModal, deletePet }: DeleteModalProps) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View flex center backgroundColor={Colors.translucent}>
        <View
          backgroundColor={Colors.white}
          width={"93%"}
          height={"42%"}
          padding-20
          style={{ borderRadius: 12, elevation: 5, maxWidth: 500 }}
        >
          <View padding-20={Platform.OS === "android" ? "20%" : 0} center>
            <View center marginB-10>
              <Image
                source={require("../assets/danger.png")}
                resizeMode={"contain"}
              />
            </View>
            <Text text60BL marginB-15 center>
              ¿Estás seguro de eliminar el perfil de tu mascota?
            </Text>

            <Text text80B center color={Colors.gray}>
              Esta acción borrará toda la información de forma irreversible.
            </Text>
            <View row width={'80%'} center marginT-15 style={{justifyContent: "space-between"}}>
              <TouchableOpacity
                center
                padding-6
                style={{
                  width: "40%",
                  height: "50%",
                  borderRadius: 16,
                  borderColor: Colors.danger,
                  borderWidth: 2,
                }}
                backgroundColor={Colors.danger}
                onPress={deletePet}
              >
                <Text text80 color={Colors.white}>
                  Sí, eliminar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity center
                padding-6
                style={{
                  width: "40%",
                  height: "50%",
                  borderRadius: 16,
                  borderColor: Colors.danger,
                  borderWidth: 2,
                }}
                 onPress={closeModal}>
                <Text  text80 color={Colors.danger}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;