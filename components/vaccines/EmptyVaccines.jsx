import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const EmptyVaccines = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Aún no es necesario aplicar alguna vacuna a tu mascota</Text>
    </View>
  );
};

export default EmptyVaccines;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  text: {
    fontWeight: "500"
  },
});
