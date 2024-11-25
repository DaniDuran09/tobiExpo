import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Platform,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Colors } from "../styles/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import Entypo from "react-native-vector-icons/Entypo";
import { useDispatch, useSelector } from "react-redux";
import { formatDateToDDMMYYYY } from "../utils/scripts";
import { setUserInfo } from "../redux/slice/userSlice";
import { Modal } from "react-native-paper";
import TobiButton from "../components/TobiButton";
import Toast from "react-native-toast-message";
import { DateTimePicker } from "react-native-ui-lib";

const SignInScreen = (props) => {
  const { user, setUser } = props;

  const [visible, setVisible] = useState(true);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const userInfo = useSelector((store) => store.user.userInfo);

  const dispatch = useDispatch();

  useEffect(() => {
    const updatedInfo = {
      ...userInfo,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      birtday: formatDateToDDMMYYYY(date),
      password: user.password,
    };
    dispatch(setUserInfo(updatedInfo));
  }, [user, date]);

  const handleDateConfirm = (date) => {
    const selectedDate = new Date(date)
    const today = new Date();
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(today.getFullYear() - 100);

    if (selectedDate > today) {
      Toast.show({
        type: "error",
        text1: "Fecha no válida",
        text2: `La fecha de nacimiento no puede ser en el futuro.`,
      });
    } else if (selectedDate < hundredYearsAgo) {
      Toast.show({
        type: "error",
        text1: "Fecha no válida",
        text2: `La fecha de nacimiento no puede ser hace más de 100 años.`,
      });
    } else {
      setUser({ ...user, birtday: selectedDate });
      setOpen(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: "column" }}
        behavior={Platform.OS == "ios" && "height"}
        enabled
      >
        <ScrollView>
          <View>
            <View
              style={{
                alignItems: "flex-start",
                paddingLeft: 20,
                marginTop: 50,
              }}
            >
              <Image
                source={require("../assets/frame.png")}
                style={{ height: 80, width: 150 }}
                resizeMode={"contain"}
              />
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "900",
                  textAlign: "center",
                  color: "#EF4136",
                  marginTop: 20,
                }}
              >
                Registro
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  textAlign: "center",
                  color: "#EF4136",
                  marginTop: 20,
                }}
              >
                Tus datos personales
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <TextInput
                placeholder="Nombre"
                placeholderTextColor="#000"
                elevation={5}
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => setUser({ ...user, name: val })}
              />
              <TextInput
                placeholder="Apellido"
                placeholderTextColor="#000"
                elevation={5}
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => setUser({ ...user, last_name: val })}
              />
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                elevation={5}
                placeholderTextColor="#000"
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => setUser({ ...user, email: val })}
              />
              <TextInput
                keyboardType="numeric"
                placeholder="Celular"
                elevation={5}
                placeholderTextColor="#000"
                maxLength={10}
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => setUser({ ...user, phone: val })}
              />
              {/* <TextInput
                keyboardType="numeric"
                placeholder="Código postal"
                elevation={5}
                placeholderTextColor="#000"
                maxLength={10}
                style={styles.textInput}
                secureTextEntry={false}
                onChangeText={(val) => setUser({ ...user, cp: val })}
              /> */}
              {/* <TouchableWithoutFeedback onPress={() => setOpen(true)}>
                <View
                  elevation={5}
                  style={{
                    width: "90%",
                    backgroundColor: "white",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: "5%",
                    borderRadius: 4,
                    height: 60,
                    marginTop: "8%",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 15,
                      color: "#000",
                      paddingVertical: 10,
                    }}
                  >
                    
                  </Text>
                  <Image
                    source={require("../assets/pastel.png")}
                    style={{ height: 30, width: 30 }}
                    resizeMode={"contain"}
                  />
                </View>
              </TouchableWithoutFeedback> */}
              {/* {open && (
                <View style={styles.modalContent}>
                  <Text style={styles.dateSelectText}>
                    Selecciona tu fecha de nacimiento
                  </Text>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      setDate(selectedDate);
                    }}
                    style={{ backgroundColor: Colors.secondaryColor }}
                  />
                  <TobiButton
                    onSubmit={() => handleDateConfirm(date)}
                    buttonText={"Confirmar"}
                  />
                </View>
              )} */}
              <View
                elevation={5}
                style={{
                  width: "90%",
                  backgroundColor: "white",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: "5%",
                  borderRadius: 4,
                  height: 60,
                  marginTop: "8%",
                }}
              >
                <DateTimePicker
                display="spinner"
                  style={[
                    styles.birthdayContainer,
                    { paddingHorizontal: 0, marginTop: 0, width: 300, height: 60 },
                  ]}
                  title={"Select date"}
                  placeholder={
                    user?.birtday === ""
                      ? "Fecha de nacimiento"
                      : `${user?.birtday?.toLocaleDateString("es-us")}`
                  }
                  mode={"date"}
                  onChange={(selectedDate) => {
                    setDate(selectedDate);
                    handleDateConfirm(selectedDate)
                  }}
                />
              </View>
              <View
                style={[
                  styles.textInput,
                  {
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  },
                ]}
              >
                <TextInput
                  placeholder="Establecer contraseña"
                  secureTextEntry={visible}
                  //elevation={5}
                  placeholderTextColor="#000"
                  style={styles.passwordStyles}
                  autoCapitalize="none"
                  onChangeText={(val) => setUser({ ...user, password: val })}
                />
                <TouchableOpacity onPress={() => setVisible(!visible)}>
                  <Entypo
                    name={visible ? "eye-with-line" : "eye"}
                    size={25}
                    color={Colors.gray}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignInScreen;

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  dateSelectText: {
    alignSelf: "center",
  },
  modalContent: {
    position: "absolute",
    backgroundColor: Colors.secondaryColor,
    width: "93%",
    height: "100%",
    padding: 20,
    borderRadius: 12,
    justifyContent: "center",
    maxWidth: 500,
    zIndex: 10,
  },
  textInput: {
    height: 60,
    width: "90%",
    borderRadius: 4,
    paddingLeft: 20,
    backgroundColor: Colors.white,
    marginTop: "8%",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  passwordStyles: {
    width: "80%",
    height: 60,
  },
  icon: {
    marginRight: 20,
  },
});
