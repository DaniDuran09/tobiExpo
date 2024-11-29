import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, gradientColors} from '../styles/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const NoPets = () => {
  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
    <View style={styles.gradientInter}>
      <Text style={styles.mainText}>No hay mascotas registradas</Text>
    </View>
  </LinearGradient>
  );
};

export default NoPets;

const styles = StyleSheet.create({
  gradient: {
    height: 60,
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    border: 10,
  },
  gradientInter: {
    height: '92%',
    width: '98%',
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    color: Colors.primaryColor,
    fontSize: 18,
    fontWeight: '600',
  },
});
