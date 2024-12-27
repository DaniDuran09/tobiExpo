import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {Colors, gradientColors} from '../styles/Colors';
import NoPets from './NoPets';

const NoPetsHome = () => {
  return (
    <View style={styles.container}>
     <NoPets/>
      <Text style={styles.secondaryText}>
        Agregue y actualice los detalles de su mascota
      </Text>
      <View style={styles.blockContainer}>
        <View style={styles.block}>
          <Text style={styles.blockTitle}>SALUD</Text>
          <Text style={styles.blockText}>Próxima visita</Text>
          <Text style={styles.blockText}>---</Text>
          <Text style={styles.blockText}>Faltan</Text>
          <Text style={styles.blockText}>---</Text>
          <Text style={{fontSize: 14, color: 'black', fontWeight: '300'}}>
            + info
          </Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.blockTitle}>BIENESTAR</Text>
          <Text style={styles.blockText}>Recomendación</Text>
          <Text style={styles.blockText}>---</Text>
        </View>
      </View>
      <View style={styles.blockContainer}>
        <View style={styles.block}>
          <Text style={styles.blockTitle}>PESO</Text>
          <Text style={styles.blockText}>De         a</Text>
          <Text style={styles.blockText}>---</Text>
          <Text style={styles.blockText}>Real</Text>
          <Text style={styles.blockText}>---</Text>
        </View>
        <View style={styles.block}>
          <Text style={styles.blockTitle}>NUTRICIÓN</Text>
          <Text>PRÓXIMAMENTE...</Text>
        </View>
      </View>
      <View style={styles.blockContainer}>
        <View style={styles.block}>
          <Text style={styles.blockTitle}>ACTIVIDAD</Text>
          <Text>PRÓXIMAMENTE...</Text>
        </View>
        <View style={{height: '100%', width: '45%'}}></View>
      </View>
    </View>
  );
};

export default NoPetsHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  
  secondaryText: {
    marginTop: '3%',
    fontWeight: '300',
    paddingBottom: "5%",
    width: "110%",
    textAlign: "center",
    backgroundColor: Colors.white,
    
  },
  blockTitle: {
    fontSize: 14,
    color: 'grey',
    fontWeight: 'bold',
  },
  blockContainer: {
    marginTop: '5%',
    flexDirection: 'row',
    gap: 20,
    width: "90%",
    height: 200,
    opacity: 0.5,
  },
  block: {
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    height: '100%',
    width: '45%',
    paddingHorizontal: 10,
    paddingTop: "4%",
    backgroundColor: Colors.lightGray,
  },
  blockText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '400',
    marginTop: "5%"
  },
});
