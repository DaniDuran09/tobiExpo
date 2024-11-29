import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '../styles/Colors';

const InfoModal = (props) => {
    const{infoVisible, closeModal, title, description} = props;
  return (
    <Modal
    transparent={true}
    visible={infoVisible}
    animationType="fade"
    onRequestClose={closeModal}
  >
    <TouchableOpacity style={styles.modalContainer} onPress={closeModal}>
      <View style={styles.modalContent}>
        <View style={styles.containerTitleModal}>
          <Text style={styles.titleModal}>{title}</Text>

          <Text style={styles.textModal}>
            {description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  </Modal>
  )
}

export default InfoModal

const styles = StyleSheet.create({
      titleModal: {
        fontWeight: "900",
        marginBottom: 5,
      },
      containerTitleModal: {
        
      },
      modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0)",
      },
      modalContent: {
        backgroundColor: "#E5E3E3",
        opacity: 0.95,
        width: "93%",
        marginTop: "80%",
        height: "15%",
        padding: 20,
        borderRadius: 12,
        justifyContent: "center",
        elevation: 5,
        maxWidth: 500,
      },
})