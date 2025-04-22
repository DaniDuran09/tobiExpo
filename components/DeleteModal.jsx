import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Colors} from '../styles/Colors';

const DeleteModal = props => {
  const {visible, closeModal, deletePet} = props;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={closeModal}>
      <View style={styles.modalContainer} onPress={closeModal}>
        <View style={styles.modalContent}>
          <View style={Platform.OS != 'android' && styles.containerTitleModal}>
            <Image
              source={require('../assets/danger.png')}
              resizeMode="container"
              style={styles.dangerIcon}
            />
            <Text style={styles.titleModal}>
            ¿Estás seguro de eliminar el perfil de tu mascota?
            </Text>
            <Text style={styles.moreInfo}>
            Esta acción borrará toda la 
            información de forma irreversible.
            </Text>
            <View style={styles.buttonsContainer}>
            <TouchableOpacity
                style={[styles.button, {backgroundColor: Colors.danger}]}
                onPress={deletePet}>
                <Text style={[styles.textButton, {color: Colors.white}]}>
                  Si, eliminar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={closeModal}>
                <Text style={[styles.textButton, {color: Colors.danger}]}>
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

const styles = StyleSheet.create({
  titleModal: {
    fontWeight: '500',
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  containerTitleModal: {
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  moreInfo: {
    fontWeight: '300',
    textAlign: 'center',
  },
  dangerIcon: {
    alignSelf: 'center',
    marginBottom: '5%',
  },
  modalContent: {
    backgroundColor: Colors.white,
    width: '93%',
    height: '42%',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    maxWidth: 500,
  },

  buttonsContainer: {
    flexDirection: 'row',
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: '15%',
  },
  button: {
    width: '40%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderRadius: 16,
    borderColor: Colors.danger,
    borderWidth: 2,
  },
  textButton: {
    fontWeight: '600',
  },
});
