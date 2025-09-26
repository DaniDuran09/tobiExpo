import { View, KeyboardAvoidingView, Platform, ScrollView, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler';
import { Text, TouchableOpacity } from 'react-native-ui-lib';
import { Colors } from '../../../styles/Colors';
import PinValidate from '../../../components/atoms/PinValidate';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiFetcher from '../../../modules/ApiFetcher';

export default function ValidateMail({ route }: any) {
  const { email } = route.params;
  const navigation = useNavigation<any>();
  const [pin, setPin] = useState('');
  const apiFetcher = new ApiFetcher();

  const handlePinChange = (pinValue: string) => {
    setPin(pinValue)
  }
  useEffect(() => {
    console.log("pin", pin)
  }, [pin])

  const validateCode = async () => {
    if (pin.length === 5) {
      try { 
        const response = await apiFetcher.verifyPin({ email: email, token: pin });
        console.log("Response", response.data);
          navigation.navigate("UserStepsRegister", { email: email })
      }
      catch (error) {

      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >

      <TouchableOpacity br100 style={{ width: 100, height: 50 }} row centerV onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={45} color="black" />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image
            source={require('../../../assets/frame.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Registro</Text>
          <Text style={styles.subtitle}>Verificación</Text>
        </View>

        <View style={styles.form}>
          <View style={{ width: "100%", height: "100%", backgroundColor: 'white', borderRadius: 10, padding: 20, paddingTop: 50, alignItems: 'center' }}>
            <Text text70H center>Te hemos enviado un código de
              verificación al mail:
            </Text>
            <Text text70H>{email}</Text>
            <Text text70H marginT-40>Introduce el código de 5 dígitos</Text>
            <PinValidate onPinChange={handlePinChange} />
            <TouchableOpacity style={styles.buttonNext}
            onPress={()=>
            /*{}
              navigation.navigate("UserStepsRegister", { email: email })
              console.log("email", email)
            }*/
              validateCode()
            }
            
            >
              <Text style={styles.textNext}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondaryColor,
    paddingTop: 50,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 70,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  logo: {
    height: 80,
    width: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#EF4136',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#EF4136',
    marginTop: 10,
  },
  form: {
    alignItems: 'center',
    height: '100%'
  },
  textInput: {
    height: 60,
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    padding: 20,
    backgroundColor: Colors.secondaryColor,
  },
  buttonNext: {
    height: 40,
    backgroundColor: '#EF4136',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
  },
  textNext: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
});
