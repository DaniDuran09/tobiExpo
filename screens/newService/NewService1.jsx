import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, Modal } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const navigation = useNavigation;
const NewService1 = () => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.textTitle}>Cuéntanos, lo haremos por ti</Text>
      <Text style={styles.textTitle}>¿Qué necesita tu mascota?</Text>
      <View>
        <TextInput
          multiline
          numberOfLines={4}
          // value={text}
          // onChangeText={setText}
          placeholder="Escribe el servicio que te gustaría encontrar..."
          style={styles.textInput}
        />
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.scheduleAppointmentButton}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.textButton}>Enviar</Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.containerTitleModal}>
              <Text style={styles.titleModal}>
                Gracias por compartirnos tus ideas, problemas e inquietudes.
              </Text>

              <Text style={styles.titleModal}>
                Estamos trabajando para que Tobi sea mejor para todos.
              </Text>
            </View>
            <View style={styles.modalButtons}>
              <Icon name="heart" size={35} color={Colors.red} />

              <TouchableOpacity
                style={styles.modalButtonLogout}
                onPress={() => {
                  setVisible(false);
                }}
              >
                <Text style={styles.textLogout}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default NewService1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  questionContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  question: {
    fontSize: 20,
    fontWeight: "600",
  },
  secondaryText: {
    marginTop: 15,
    fontSize: 18,
  },
  optionsContainer: {
    marginTop: "10%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
  },
  image: {
    width: 30,
    height: 30,
  },
  option: {
    width: 70,
    height: 70,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    marginTop: "10%",
    borderRadius: 5,
    width: "100%",
    minHeight: 300,
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top",
  },
  bottomContainer: {
    marginTop: "20%",
  },
  scheduleAppointmentButton: {
    borderWidth: 1,
    width: "100%",
    borderColor: Colors.gray,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  textButton: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.gray,
  },
  textModalLogout: {
    color: "#71727A",
  },
  titleModal: {
    fontWeight: "900",
    marginBottom: 20,
  },
  containerTitleModal: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    height: "33%",
    padding: 20,
    borderRadius: 12,
    justifyContent: "center",
    elevation: 5,
    maxWidth: 500,
  },
  modalButtons: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonCancel: {
    width: "45%",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#415972",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButtonLogout: {
    padding: 10,
    borderRadius: 12,
    width: 80,
    backgroundColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  textLogout: {
    color: "#fff",
  },
  textTitle:{
    width:"100%",
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize:18,
    fontWeight: "900",
  }
});
