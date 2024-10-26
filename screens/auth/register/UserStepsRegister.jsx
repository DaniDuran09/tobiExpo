import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import StepIndicator from "react-native-step-indicator";
import { Colors } from "../../../styles/Colors";
import { customStyles } from "../../../styles/GlobalStyles";

import { useDispatch, useSelector } from "react-redux";
import SignInPetInfoScreen from "../../SignInPetInfoScreen";
import SignInScreen from "../../SignInScreen";
import SignInPetScreen from "../../SignInPetScreen";
import FinalScreenRegisterPet from "../../pet/register/FinalScreenRegisterPet";
import ApiFetcher from "../../../modules/ApiFetcher";
import { useNavigation } from "@react-navigation/native";
import { clearUser, setUserInfo } from "../../../redux/slice/userSlice";
import AppStorage from "../../../modules/AppStorage";
import Toast from "react-native-toast-message";
import { clearPetInfo } from "../../../redux/slice/petSlice";

const UserStepsRegister = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const labels = ["1", "2", "3", "4"];
  const [imageSource, setImageSource] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const userInfo = useSelector((store) => store.user.userInfo);
  const [user, setUser] = useState({
    name: "",
    last_name: "",
    phone: "",
    email: "",
    birtday: "",
    password: "",
  });
  const [data, setData] = useState({
    name: "",
    birthday: "",
    weight: 0,
    typePet: 0,
    gender: "",
    pet_breed_id: 0,
    sterilized: false,
  });

  const apiFetcher = new ApiFetcher();
  const appStorage = new AppStorage();

  useEffect(() => {
    dispatch(clearUser());
    dispatch(clearPetInfo());
    console.log("UserInfo: ", userInfo);
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validFirsScreen = () => {
    if (
      user.name === "" ||
      user.last_name === "" ||
      user.email === "" ||
      user.phone === "" ||
      user.birtday === "" ||
      user.password === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Campos incompletos",
        text2: `Debes llenar todos los campos`,
      });
      return false;
    } else if (!validateEmail(user.email)) {
      Alert.alert("Tobi", "La estructura del correo es inválida");
      return false;
    } else return true;
  };

  const validSecondScreen = () => {
    console.log("data: ", data);
    if (data.namePet != "" && data.birthday != "" && data.typePet != 0) {
      return true;
    } else {
      console.log("Data: ", data);
      Toast.show({
        type: "error",
        text1: "Campos incompletos",
        text2: `Debes llenar todos los campos`,
      });
      return false;
    }
  };

  const validThirdScreen = () => {
    if (data.pet_breed_id != 0 && data.weight != 0) {
      return true;
    } else {
      console.log("Data: ", data);
      Toast.show({
        type: "error",
        text1: "Campos incompletos",
        text2: `Debes llenar todos los campos`,
      });
      return false;
    }
  };

  const doRegister = async () => {
    try {
      console.log("Lo que trataré de mandarle: ", userInfo);
      const response = await apiFetcher.registerUser(userInfo);
      console.log("Response: ", response);
      if (response.code != 200 && response.code != 201) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: `${response.errors}`,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }],
        });
      } else {
        console.log("LE MANDO LA INFO PORQUE ENTRO AL ELSE");
        await saveInfoUser(response.data);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ocurrió un error al hacer el registro",
        text2: `Intente de nuevo más tarde`,
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
      console.log("Error en el registro: ", error);
    }
  };

  const savePhoto = async () => {
    try {
      console.log("el image: ", imageSource);
      const formData = new FormData();
      formData.append("picture", {
        uri: imageSource.uri,
        type: imageSource.type,
        name: imageSource.fileName,
      });

      const response = await apiFetcher.updatePictureProfile(formData);
      console.log("Response: ", response);
      if (response.code == 200) {
        const user = await apiFetcher.getProfile();
        await appStorage.saveUser(user.data);
      } else
        Alert.alert(
          "Ocurrió un error al guardar la foto",
          "Intente de neuvo más tarde"
        );
    } catch (error) {
      console.log("Ocurrió un error: ", error);
    }
  };

  const saveInfoUser = async (data) => {
    console.log("ESTO TENGO EN LA DATAAAA: ", data);
    await appStorage.saveUser(data);
    dispatch(setUserInfo(data));
    await appStorage.saveAppToken(data.token);
  };

  const nextStep = (step) => {
    let valid;
    switch (step) {
      case 0:
        valid = validFirsScreen();
        console.log("Entro: ", user);
        break;
      case 1:
        valid = validSecondScreen();
        break;
      case 2:
        valid = validThirdScreen();
        valid && doRegister();
        break;
      case 3:
        savePhoto();
        navigation.replace("Home");
        break;
      default:
        break;
    }
    valid &&
      setCurrentPosition((prev) => Math.min(prev + 1, labels.length - 1));
  };

  const renderStepContent = () => {
    switch (currentPosition) {
      case 0:
        return <SignInScreen user={user} setUser={setUser} />;
      case 1:
        return <SignInPetScreen user={user} data={data} setData={setData} />;
      case 2:
        return <SignInPetInfoScreen pet={data} user={user} />;
      case 3:
        return (
          <FinalScreenRegisterPet
            backgroundColor={Colors.secondaryColor}
            imageSource={imageSource}
            setImageSource={setImageSource}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepContent}>{renderStepContent()}</View>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentPosition}
        labels={labels}
        stepCount={4}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.buttonNext}
          onPress={() => nextStep(currentPosition)}
        >
          <Text style={styles.textNext}>
            {currentPosition != 3 ? "Siguiente" : "Finalizar"}
          </Text>
        </TouchableOpacity>
        {/* <Text
            style={styles.button}
            onPress={() => setCurrentPosition(prev => Math.max(prev - 1, 0))}>
            Previous
          </Text>
          <Text
            style={styles.button}
            onPress={() =>
              setCurrentPosition(prev => Math.min(prev + 1, labels.length - 1))
            }>
            Next
          </Text> */}
      </View>
    </View>
  );
};

export default UserStepsRegister;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondaryColor,
    flex: 1,
    padding: 15,
  },
  stepContent: {
    width: "100%",
    height: "75%",
    marginBottom: 10,
  },
  buttonsContainer: {},
  button: {
    fontSize: 16,
    color: "#007bff",
  },
  buttonNext: {
    marginTop: 30,
    height: 60,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#EF4136",
    borderRadius: 65,
    justifyContent: "center",
  },
  textNext: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "700",
  },
});
