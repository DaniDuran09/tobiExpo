import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { TextInput, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { View, Text, TouchableOpacity } from "react-native-ui-lib"
import Entypo from "react-native-vector-icons/Entypo";
import { Colors } from "../../styles/Colors";

export default function LoginForm({ onSubmit }) {

  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const [visible, setVisible] = useState(true);

  const navigation = useNavigation()

  return (
    <>
      <View
        height={"25%"}
        width={"100%"}
        centerH
        style={{
          justifyContent: "space-around",
        }}
      >
        <TextInput
          placeholder="Email"
          placeholderTextColor="#000"
          elevation={5}
          keyboardType="email-address"
          style={[
            styles.textInput,
            {
              color: "#000",
            },
          ]}
          autoCapitalize="none"
          onChangeText={(val) => setInput({ ...input, username: val })}
        />
        <View
          row
          centerV
          style={[
            styles.textInput,
            {
              justifyContent: "space-between",
              flexDirection: "row",
            },
          ]}
        >
          <TextInput
            placeholder="Contraseña"
            secureTextEntry={visible}
            style={{ width: "80%", height: 60 }}
            placeholderTextColor="#000"
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

      <View
        height={"10%"}
        width={"100%"}
        row
        centerV
        style={{
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text
            text80R
            center
            color={"#E6F8DB"}
            underline
          >
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>
        <Text
          text80R
          center
          color={"#E6F8DB"}
          onPress={() => navigation.navigate("UserStepsRegister")}
        >
          Registrarse
        </Text>
      </View>

      <View
        height={"15%"}
        width={"100%"}
        center
      >
        <TouchableWithoutFeedback onPress={() => onSubmit(input)}>
          <View
            height={60}
            width={"80%"}
            backgroundColor="#FA6650"
            centerV
            style={{
              borderRadius: 32,
            }}
          >
            <Text
              center
              text70BO
              color="white"
            >
              Entrar
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  textInput: {
    height: 60,
    width: "90%",
    borderRadius: 6,
    paddingLeft: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  }
});
