import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../styles/Colors";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const changePassword = async () => {
    let data = {};
  };
  return (
    <View style={styles.container}>
      <View style={{ padding: 10 }}>
        <View>
          <Text style={styles.title}>
            Escribe la contraseña actual para poder actualizarla
          </Text>
        </View>
        <View>
          <Text style={styles.label}>Contraseña actual</Text>
          <TextInput
            elevation={5}
            value={password}
            placeholderTextColor="#000"
            style={styles.textInput}
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={(e) => setPassword(e)}
          />
          <Text style={styles.label}>Nueva contraseña</Text>
          <TextInput
            elevation={5}
            value={newPassword}
            placeholderTextColor="#000"
            style={styles.textInput}
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={(e) => setNewPassword(e)}
          />
          <Text style={styles.label}>Confirmar contraseña nueva</Text>
          <TextInput
            elevation={5}
            value={repeatNewPassword}
            placeholderTextColor="#000"
            style={styles.textInput}
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={(e) => setRepeatNewPassword(e)}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonChangePassword}
          onPress={changePassword}
        >
          {loading ? (
            <ActivityIndicator size={"small"} color={Colors.white} />
          ) : (
            <Text style={styles.changeText}>Cambiar contraseña</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  title: {
    marginBottom: 5,
    marginTop: 20,
    fontWeight: "400",
    fontSize: 18,
  },
  textInput: {
    height: 60,
    width: "100%",
    paddingLeft: 20,
    justifyContent: "center",
    backgroundColor: Colors.lightBlue,
    borderRadius: 4,
  },
  label: {
    marginBottom: 5,
    marginTop: 20,
    fontWeight: "400",
    fontSize: 13,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    alignItems: "center",
  },
  buttonChangePassword: {
    backgroundColor: Colors.primaryColor,
    width: "95%",
    minWidth: 350,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 65,
  },
  changeText: {
    color: Colors.white,
    fontWeight: "500",
    fontSize: 17,
  },
});
