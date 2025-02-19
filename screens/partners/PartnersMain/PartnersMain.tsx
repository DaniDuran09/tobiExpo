import React from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../styles/Colors';
import ServiceList from '../../../components/partners/ServiceList';
import { NavigationType } from './types'; // Asegúrate de importar el tipo correctamente

const PartnersMain = () => {
  const navigation = useNavigation<NavigationType>();

  const goToSelectedScreen = (type: number) => {
    navigation.navigate('SelectService', { type });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerAll}>
        <View style={styles.headerContainer}>
          <Text style={styles.textOptionsForYou}>Aquí encontrarás tus servicios favoritos</Text>
        </View>
        <View style={styles.optionsContainer}>
          <ServiceList
            imageSource={require('../../../assets/vetBackground.png')}
            title="Veterinarios"
            subtitle="Certificados"
            onPress={() => goToSelectedScreen(2)}
          />
          <ServiceList
            imageSource={require('../../../assets/groomingBackground.png')}
            title="Grooming"
            subtitle="Spa, baños y estética"
            onPress={() => goToSelectedScreen(3)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  containerAll: {
    padding: 15,
  },
  headerContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  textOptionsForYou: {
    fontSize: 18,
    color: Colors.gray,
  },
  optionsContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
});

export default PartnersMain;
