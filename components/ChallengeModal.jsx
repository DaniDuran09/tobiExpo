import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Colors } from "../styles/Colors";

const ChallengeModal = (props) => {
  const { challengeVisible, closeModalChallenge, text } = props;
  return (
    <Modal
      transparent={true}
      visible={challengeVisible}
      animationType="fade"
      onRequestClose={closeModalChallenge}
    >
      <View style={styles.modalContainer} onPress={closeModalChallenge}>
        <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeContainer} onPress={closeModalChallenge}>
          <Text style={styles.close}>X</Text>
        </TouchableOpacity>
          <View style={styles.containerTitleModal}>
            <Text style={styles.titleModal}>
              {text}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ChallengeModal;

const styles = StyleSheet.create({
  titleModal: {
    fontWeight: "900",
    marginBottom: 20,
    fontSize: 32,
    color: Colors.primaryColor,
    textAlign: "center"
  },
  containerTitleModal: {
    padding: 20
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.primaryColor,
    opacity: 0.9,
    width: "93%",
    height: "33%",
    padding: 20,
    borderRadius: 12,
    justifyContent: "center",
    elevation: 5,
    maxWidth: 500,
  },
  closeContainer:{
    position: "absolute",
    alignSelf: "flex-end",
    top: 15,
    right: 15,
    zIndex: 2
  },
  close:{
    fontSize: 20,
    fontWeight: "600"
  },
});
