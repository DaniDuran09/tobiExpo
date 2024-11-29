import React, { useState } from "react";
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
} from "react-native";
// import * as Animatable from 'react-native-animatable';
// import { LinearGradient } from 'expo-linear-gradient';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Feather from 'react-native-vector-icons/Feather';

import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-native-date-picker";
import { updateData } from "../redux/generalDuck";

import { petEdit, petPicture } from "../services";

const EditPet = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { petInfo } = route.params;
  const { token } = useSelector((store) => store.general.user);
  const update = useSelector((store) => store.general.update);
  const [user, setUser] = useState({
    name: petInfo?.name,
    last_name: petInfo?.last_name,
    age: petInfo?.age.toString(),
    weight: petInfo?.weight,
    birthday: "",
  });

  const [loading, setLoading] = React.useState(true);
  const [date, setDate] = React.useState(new Date());
  const [open, setOpen] = React.useState(false);
  const [cameraType, setCameraType] = React.useState("front");
  const [activeModal, setActiveModal] = React.useState(false);
  const [imageSourceFront, setImageSourceFront] = React.useState("");
  const [picture, setPicture] = React.useState(0);

  const onSubmit = () => {
    const json = {
      name: user.name,
      last_name: user.last_name,
      age: parseInt(user.age),
      weight: parseInt(user.weight),
    };
    //console.log('json', json)
    if (
      user.name === null ||
      user.last_name === null ||
      user.age === null ||
      user.weight === null
    ) {
      Alert.alert("Tobi", "Debes llenar todos los campos", [
        { text: "OK", onPress: () => null },
      ]);
    } else {
      petEdit(token, petInfo.id, json)
        .then((response) => {
          //console.log('response', response.data)
          // dispatch(generalDataAction(json))
          dispatch(updateData(!update));
          navigation.goBack();
        })
        .catch((err) => {
          console.log("err", err);
          Alert.alert("Sucedio un error!", "El servicio no esta disponible", [
            { text: "OK", onPress: () => setLoading(false) },
          ]);
        });
    }
    //navigation.navigate('ProfileEditPet', { item: user })
  };

  const savePhoto = (val, typecam) => {
    //console.log('erick', typecam)
    if (typecam === "front") {
      if (val === "Cancelar" || val === "Continuar") setImageSourceFront("");
      else {
        const formData = new FormData();
        formData.append("picture", {
          uri: val,
          type: "image/jpeg", // or photo.type
          name: "image",
        });
        petPicture(token, petInfo.id, formData)
          .then((response) => {
            //console.log('erick',response.data )
            setImageSourceFront(response.data);
            dispatch(updateData(!update));
            setPicture(1);
            setLoading(false);
          })
          .catch((err) => {
            console.log("errpetPicture", err);
            setLoading(false);
            //AlertError(err.response.status, type = 2, msg = 'Estado de cuenta')
          });
      }
    }
    setActiveModal(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      behavior={"height"}
      enabled
    >
      <ScrollView>
        <View
          style={{
            backgroundColor: "#fff", //#E6F8DB
            height: height / 1,
            width: width,
          }}
        >
          <View
            style={{
              height: "20%",
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              paddingHorizontal: 25,
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                setActiveModal(true), setCameraType("front");
              }}
            >
              <View>
                <Image
                  source={{
                    uri: picture === 0 ? petInfo.picture : imageSourceFront,
                  }}
                  style={{
                    height: 110,
                    width: 110,
                    borderRadius: 100,
                    zIndex: 0,
                  }}
                  resizeMode={"contain"}
                />
                <View
                  style={{
                    height: 110,
                    width: 110,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    zIndex: 1,
                    position: "absolute",
                    borderRadius: 100,
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    paddingBottom: 15,
                    paddingRight: 15,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.7)",
                      padding: 7,
                      borderRadius: 100,
                    }}
                  >
                    <Image
                      source={require("../assets/camW.png")}
                      style={{ height: 25, width: 25 }}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                color: "#EF4136",
                marginLeft: 20,
              }}
            >
              Edita Tu Mascosta
            </Text>
          </View>
          <View
            style={{
              height: "60%",
              width: "100%",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <TextInput
              placeholder="Nombre"
              placeholderTextColor="#000"
              elevation={5}
              value={user?.name}
              style={[
                styles.textInput,
                {
                  color: "#000",
                },
              ]}
              autoCapitalize="none"
              onChangeText={(val) => setUser({ ...user, name: val })}
            />
            <TextInput
              placeholder="Apellido"
              elevation={5}
              value={user?.last_name}
              placeholderTextColor="#000"
              style={[
                styles.textInput,
                {
                  color: "#000",
                },
              ]}
              autoCapitalize="none"
              onChangeText={(val) => setUser({ ...user, last_name: val })}
            />
            <TextInput
              keyboardType="numeric"
              placeholder="Años"
              elevation={5}
              value={user?.age}
              placeholderTextColor="#000"
              maxLength={3}
              style={[
                styles.textInput,
                {
                  color: "#000",
                },
              ]}
              autoCapitalize="none"
              onChangeText={(val) => setUser({ ...user, age: val })}
            />
            <TextInput
              keyboardType="numeric"
              placeholder="Peso de tu mascota"
              elevation={5}
              value={user?.weight}
              placeholderTextColor="#000"
              style={[
                styles.textInput,
                {
                  color: "#000",
                },
              ]}
              autoCapitalize="none"
              onChangeText={(val) => setUser({ ...user, weight: val })}
            />
            <TouchableWithoutFeedback onPress={() => setOpen(true)}>
              <View
                elevation={5}
                style={{
                  width: "90%",
                  backgroundColor: "#D6EFFF",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: "5%",
                  borderRadius: 10,
                }}
              >
                <DatePicker
                  modal
                  open={open}
                  date={date}
                  onConfirm={(date) => {
                    setOpen(false);
                    setUser({ ...user, birthday: date });
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                  locale={"es"}
                  mode={"date"}
                  title={"Cumpleaños"}
                />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 14,
                    color: "black",
                    fontWeight: "400",
                    paddingVertical: 10,
                  }}
                >
                  {user.birthday === ""
                    ? petInfo.birthday
                    : `${user?.birthday.toLocaleDateString("es-us")}`}
                </Text>
                <Image
                  source={require("../assets/pastel.png")}
                  style={{ height: 30, width: 30 }}
                  resizeMode={"contain"}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              height: "20%",
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback onPress={onSubmit}>
              <View
                style={{
                  height: 50,
                  width: "80%",
                  backgroundColor: "#EF4136",
                  borderRadius: 10,
                  justifyContent: "center",
                  marginBottom: 15,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 16,
                    color: "white",
                    fontWeight: "700",
                  }}
                >
                  Guardar
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditPet;

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
  textInput: {
    height: 40,
    width: "90%",
    borderRadius: 10,
    paddingLeft: 20,
    justifyContent: "center",
    backgroundColor: "#D6EFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
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
});
