import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../styles/Colors';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ScreenInternetError = (props) => {
    const {action} = props
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ooops!</Text>
      <Image source={require('../assets/images/errorInternetImage.png')} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>
        El jefe de internet se fue de vacaciones a la playa y se le olvidó pagarlo.
        </Text>
        <Text style={styles.text}>
        Regresa más tarde y vuelve a intentarlo.
        </Text>
        <Text style={styles.text}>
        Te estamos esperando
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonOption} onPress={action}>
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScreenInternetError;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: Colors.gray,
    fontWeight: '600',
    marginBottom: '10%',
  },
  textContainer: {
    width: '70%',
    marginTop: '10%',
  },
  text: {
    fontWeight: '300',
    textAlign: 'center',
    marginTop: "3%"
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 50,
    marginTop: "10%"
  },
  buttonOption: {
    height: 50,
    width: 120,
    padding: 5,
    borderRadius: 4,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.primaryColor,
    fontWeight: "700"
  },
});
