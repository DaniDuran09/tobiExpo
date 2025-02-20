import React from 'react';
import { 
  SafeAreaView, 
  View 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../styles/Colors';
import ServiceList from '../../../components/partners/ServiceList';
import { Text } from 'react-native-ui-lib';

const PartnersMain = () => {
  const navigation = useNavigation<NavigationType>();

  const goToSelectedScreen = (type: number) => {
    navigation.navigate('SelectService', { type });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View padding-15 style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ marginTop: 10 }}>
          <Text text70 color={Colors.gray}>Aquí encontrarás tus servicios favoritos</Text>
        </View>
        <View style={{ alignItems: 'center', marginTop: 10 }}>
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

export default PartnersMain;
