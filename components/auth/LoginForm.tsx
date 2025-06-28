import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { TextInput, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { View, Text, TouchableOpacity } from "react-native-ui-lib";
import Entypo from "react-native-vector-icons/Entypo";
import { Colors } from "../../styles/Colors";
import React from "react";
import * as Notifications from 'expo-notifications';

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [input, setInput] = useState<LoginPayload>({
    username: "",
    password: "",
    expotoken:""
  });

  const [visible, setVisible] = useState<boolean>(true);

  const navigation = useNavigation<any>();

  
  useEffect(() => {
    getPushToken();
}, []);
  
  const getPushToken = async () => {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Token", token);
    setInput({...input,expotoken:token})
};

  return (
    <>
      <View width={"100%"} centerH gap-50 marginT-50>
        <View
          row
          centerV
          height={60}
          width={"90%"}
          br10
          bg-white
          style={styles.textInput}
          spread
        >
          <TextInput
            style={{ width: "100%", height: "100%", paddingLeft: 20 }}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(val) => setInput({ ...input, username: val })}
          />
        </View>
        <View row centerV height={60} width={"90%"} br10 bg-white spread>
          <TextInput
            style={{ width: "90%", height: "100%", paddingLeft: 20 }}
            placeholder="Contraseña"
            secureTextEntry={visible}
            autoCapitalize="none"
            onChangeText={(val) => setInput({ ...input, password: val })}
          />
          <TouchableOpacity onPress={() => setVisible(!visible)}>
            <Entypo
              name={visible ? "eye-with-line" : "eye"}
              size={25}
              color={Colors.gray}
              style={{ marginRight: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View row centerV spread paddingH-25 marginT-50>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text text80R center color={Colors.white} underline>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("UserStepsRegister")}
        >
          <Text text80R center color={Colors.white} underline>
            Registrarse
          </Text>
        </TouchableOpacity>
      </View>

      <View center marginT-30>
        <TouchableWithoutFeedback onPress={() => onSubmit(input)}>
          <View
            height={60}
            width={"80%"}
            backgroundColor={Colors.primaryColor}
            centerV
            br100
          >
            <Text center text70BO color={Colors.white}>
              Entrar
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  textInput: {
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
});
