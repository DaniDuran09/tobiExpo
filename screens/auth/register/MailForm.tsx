import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { TouchableOpacity } from 'react-native-ui-lib';
import { Colors } from '../../../styles/Colors';
import ApiFetcher from '../../../modules/ApiFetcher';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function MailForm() {

  const [email, setEmail] = useState<String>("");

  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation<any>();

  const validateEmail = ({ email }: any) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const sendMail = async () => {
    if (!validateEmail({ email: email })) {
      Toast.show({
        type: "error",
        text1: "Correo inválido",
        text2: `La estructura del correo es inválida`,
      });
      return;
    }
    try {
      console.log("Enviando email a", email);
      const response = await apiFetcher.sendVerification({ email: email });
      console.log("Response", response);
      if (response.status === "success") {
        navigation.navigate("ValidateMail", { email: email })
      }
      navigation.navigate("ValidateMail", { email: email })
    } catch (error: any) {
      console.log("Error al enviar email", error.message);

      if (error.message === "email.verification_already_done") {
        navigation.navigate("UserStepsRegister", { email: email })
      } else if (error.message === "email.taken") {
        Toast.show({
          type: "error",
          text1: "Correo ya registrado",
          text2: "Este correo ya tiene un usuario registrado",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Ha ocurrido un error inesperado",
        });
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
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#000"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val: any) => setEmail(val)}
          />
        </View><View style={styles.footer}>

        </View>
      </ScrollView>
      <TouchableOpacity style={styles.buttonNext} onPress={() => {
        sendMail()
        //navigation.navigate("ValidateMail",{email:"email@gmail.com"})
        console.log("email", email)
      }
      }>
        <Text style={styles.textNext}>Verificar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondaryColor,
    paddingTop: 50,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
    height: 60,
    backgroundColor: '#EF4136',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  textNext: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
});
