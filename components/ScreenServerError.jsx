import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../styles/Colors';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ScreenServerError = (props) => {
    const {refetch} = props
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Oh que pena!</Text>
      <Image source={require('../assets/images/errorServerError.png')} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Lo sentimos, nuestros gatos provocaron un problema con el servidor.
        </Text>
        <Text style={styles.text}>
          Mientras tanto podrías explorar su fascinante mundo.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonOption}>
          <Text style={styles.buttonText}>Mundo de {''}</Text>
          <Text style={styles.buttonText}>los gatos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonOption} onPress={refetch}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScreenServerError;

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
    marginTop: "2%"
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
