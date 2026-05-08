import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors } from '../../styles/Colors';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const PartnersMain = () => {
  const navigation = useNavigation();

  const goToSelectedScreen = type => {
    navigation.navigate('SelectService', { type: type });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerAll}>
        <View style={styles.headerContainer}>
          <Text style={styles.textOptionsForYou}>
            Aquí encontrarás tus servicios favoritos
          </Text>
        </View>
        <View style={styles.optionsContainer}>
          <View style={styles.containerImage}>
            <TouchableOpacity onPress={() => goToSelectedScreen(2)}>
              <Image
                source={require('../../assets/vetBackground.png')}
                style={{ width: 375, height: 250 }}
                resizeMode="contain"
              />
              <View style={styles.cover}>
                <Text style={styles.mainText}>Veterinarios</Text>
                <Text style={styles.secondaryText}>Certificados</Text>
                <View style={styles.viewMore}>
                  <Text style={styles.textViewMore}>Ver más</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.containerImage}>
            <TouchableOpacity onPress={() => goToSelectedScreen(3)}>
              <Image
                source={require('../../assets/groomingBackground.png')}
                style={{ width: 375, height: 250 }}
                resizeMode="contain"
              />
              <View style={styles.cover}>
                <Text style={styles.mainText}>Grooming</Text>
                <View style={styles.limit}>
                  <Text style={styles.secondaryText}>
                    Spa, baños y estética
                  </Text>
                  <View style={styles.viewMore}>
                    <Text style={styles.textViewMore}>Ver más</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            {/* <LinearGradient colors={['red', 'orange']} style={styles.gradient}>
              
              <TouchableWithoutFeedback
                style={styles.moreServices}
                onPress={() => navigation.navigate('NewService')}>
                <Text style={styles.text}>
                  ¿Necesitas otro producto o servicio?
                </Text>
              </TouchableWithoutFeedback>
            </LinearGradient> */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default PartnersMain;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  containerAll: {
    padding: 15,
  },
  containerImage: {
    width: '100%',
    alignItems: 'center',
  },
  textOptionsForYou: {
    fontSize: 18,
    color: Colors.gray,
  },
  headerContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  optionsContainer: {
    marginTop: 30,
    alignItems: 'center',
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
  limit: {
    width: 100,
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
  gradient: {
    marginTop: '20%',
    width: '99%',
    height: '15%',
    padding: 1,
    borderRadius: 7,
  },
  moreServices: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FF6F61',
    fontSize: 18,
    fontWeight: '600',
  },
});
