import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Colors } from '../styles/Colors';

const ImageOption = ({ visible, closeModal, selectImageFromLibrary, takePhoto }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={closeModal}>
      <View style={styles.modalContainer} onPress={closeModal}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeContainer} onPress={closeModal}>
            <Text style={styles.close}>X</Text>
          </TouchableOpacity>
          <View style={styles.containerTitleModal}>
            <Text style={styles.titleModal}>Elegir foto</Text>
            <TouchableOpacity style={styles.optionPhoto} onPress={takePhoto}>
              <Image
                source={require('../assets/camera-icon.png')}
                style={styles.image}
                resizeMode={'contain'}
              />
              <Text>Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionPhoto} onPress={selectImageFromLibrary}>
              <Image
                source={require('../assets/galery-icon.png')}
                style={styles.image}
                resizeMode={'contain'}
              />
              <Text>Subir desde la galería</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ImageOption;

const styles = StyleSheet.create({
  titleModal: {
    fontWeight: '500',
    marginBottom: 20,
    fontSize: 18,
  },
  containerTitleModal: {
    padding: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  optionPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: '5%',
  },
  modalContent: {
    backgroundColor: Colors.white,
    width: '93%',
    height: '20%',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    maxWidth: 500,
  },
  image: {
    width: 20,
    height: 20,
  },
  closeContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: 15,
    right: 15,
    zIndex: 2,
  },
  close: {
    fontSize: 20,
    fontWeight: '600',
  },
});
