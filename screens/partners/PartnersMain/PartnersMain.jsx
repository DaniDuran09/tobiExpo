import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../styles/Colors';

const ServiceOption = ({ imageSource, title, subtitle, onPress }) => (
  <View style={styles.containerImage}>
    <TouchableOpacity onPress={onPress}>
      <Image source={imageSource} style={styles.image} resizeMode="contain" />
      <View style={styles.cover}>
        <Text style={styles.mainText}>{title}</Text>
        {subtitle && (
          <View style={styles.limit}>
            <Text style={styles.secondaryText}>{subtitle}</Text>
          </View>
        )}
        <View style={styles.viewMore}>
          <Text style={styles.textViewMore}>Ver más</Text>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

const PartnersMain = () => {
  const navigation = useNavigation();
  const goToSelectedScreen = (type) => navigation.navigate('SelectService', { type });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerAll}>
        <View style={styles.headerContainer}>
          <Text style={styles.textOptionsForYou}>Aquí encontrarás tus servicios favoritos</Text>
        </View>
        <View style={styles.optionsContainer}>
          <ServiceOption
            imageSource={require('../../../assets/vetBackground.png')}
            title="Veterinarios"
            subtitle="Certificados"
            onPress={() => goToSelectedScreen(2)}
          />
          <ServiceOption
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

export default PartnersMain;

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
  containerImage: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 375,
    height: 250,  
  },
  limit: {
    width: 100,
  },
  cover: {
    position: 'absolute',
    left: 40,
    top: 80,
  },
  mainText: {
    fontSize: 24,
    fontWeight: '900',
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 10,
  },
  viewMore: {
    marginTop: 10,
    padding: 5,
    width: 80,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textViewMore: {
    color: Colors.white,
  },
});
