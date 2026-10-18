import { Alert, BackHandler, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import StepIndicator from "react-native-step-indicator";
import Icon from "react-native-vector-icons/MaterialIcons";
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
import { useRegisterMutation } from "../../../api/auth/auth";
import { formatDateToDDMMYYYY } from "../../../utils/scripts";

const UserStepsRegister = ({route}) => {
  const { email } = route.params;
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
    email: email,
    birthday: "",
    password: "",
  });
  useEffect(() => {
    setUser((prev) => ({ ...prev, email: email }));
  }, [email]);
  const [data, setData] = useState({
    name: "",
    namePet: "",
    birthday: "",
    weight: 0,
    typePet: 1,
    gender: "male",
    pet_breed_id: 0,
    sterilized: false,
  });

  const apiFetcher = new ApiFetcher();
  const appStorage = new AppStorage();

  const [registerUser] = useRegisterMutation();

  useEffect(() => {
    dispatch(clearUser());
    dispatch(clearPetInfo());
  }, []);

  const handleBack = () => {
    if (currentPosition > 0) {
      setCurrentPosition((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    const onBackPress = () => {
      if (currentPosition > 0) {
        setCurrentPosition((prev) => prev - 1);
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [currentPosition]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (currentPosition > 0) {
        e.preventDefault();
        setCurrentPosition((prev) => prev - 1);
      }
    });

    return unsubscribe;
  }, [navigation, currentPosition]);

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
      user.birthday === "" ||
      user.password === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Campos incompletos",
        text2: `Debes llenar todos los campos`,
      });
      return false;
    } else if (user.password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Contraseña inválida",
        text2: `La contraseña no debe ser menor a 6 caracteres`,
      });
      return false;
    } else if (user.phone.length < 10) {
      Toast.show({
        type: "error",
        text1: "Número de teléfono invalido",
        text2: `El número de teléfono no debe ser menor a 10 dígitos`,
      });
      return false;
    } else if (!validateEmail(user.email)) {
      Toast.show({
        type: "error",
        text1: "Correo inválido",
        text2: `La estructura del correo es inválida`,
      });
      return false;
    } else return true;
  };

  const validSecondScreen = () => {
    const petName = data.namePet || data.name || "";
    if (petName !== "" && data.birthday !== "" && data.typePet !== 0) {
      return true;
    } else {
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
      console.log("data", data);
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
      const expoToken = (await appStorage.getExpoPushToken()) || "";

      let userBirthday = user.birthday;
      if (userBirthday instanceof Date) {
        userBirthday = formatDateToDDMMYYYY(userBirthday);
      } else if (typeof userBirthday === "string" && userBirthday.includes("T")) {
        userBirthday = formatDateToDDMMYYYY(new Date(userBirthday));
      }

      const rawWeight = parseFloat(data.weight) || 0;
      const calcWeight = rawWeight > 100 ? parseInt(rawWeight) : parseInt(rawWeight * 1000);

      const registerPayload = {
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        birthday: userBirthday,
        password: user.password,
        expotoken: expoToken,
        pet: {
          name: data.namePet || data.name || "",
          last_name: "",
          birthday: data.birthday,
          gender: data.gender || "male",
          weight: calcWeight,
          activity_level_id: 1,
          pet_breed_id: Number(data.pet_breed_id) || 0,
          sterilized: Boolean(data.sterilized),
        },
      };

      console.log("Enviando registro con payload:", JSON.stringify({
        ...registerPayload,
        password: "[PROTECTED]"
      }));

      const { data: response, error } = await registerUser(registerPayload);

      if (error) {
        console.log("Error en registerUser:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: `${error.data?.errors || error.message || "Error al realizar el registro"}`,
        });
        return false;
      } else {
        await saveInfoUser(response.data);
        return true;
      }
    } catch (error) {
      console.log("Error en el registro catch: ", error);
      Toast.show({
        type: "error",
        text1: "Ocurrió un error al hacer el registro",
        text2: `Intente de nuevo más tarde`,
      });
      return false;
    }
  };

  const savePhoto = async () => {
    if (!imageSource || !imageSource.uri) return;
    try {
      const formData = new FormData();
      formData.append("picture", {
        uri: imageSource.uri,
        type: "image/jpeg",
        name: Platform.OS == "android" ? (imageSource.fileName || "photo.jpg") : (imageSource.uri.split("ImagePicker/")[1] || "photo.jpg"),
      });

      const response = await apiFetcher.updatePictureProfile(formData);
      console.log("Response foto: ", response);
      if (response.code == 200) {
        const user = await apiFetcher.getProfile();
        await appStorage.saveUser(user.data);
      } else {
        Alert.alert(
          "Ocurrió un error al guardar la foto",
          "Intente de nuevo más tarde"
        );
      }
    } catch (error) {
      console.log("Ocurrió un error: ", error);
    }
  };

  const saveInfoUser = async (data) => {
    await appStorage.saveUser(data);
    dispatch(setUserInfo(data));
    await appStorage.saveAppToken(data.token);
  };

  const nextStep = async (step) => {
    let valid;
    switch (step) {
      case 0:
        valid = validFirsScreen();
        if (valid) {
          try {
            const expoToken = await appStorage.getExpoPushToken();
            if (expoToken) {
              await apiFetcher.updateOnboardingSession(expoToken, "pet_data");
            }
          } catch (e) {
            console.log("Error actualizando onboarding session", e);
          }
        }
        break;
      case 1:
        valid = validSecondScreen();
        break;
      case 2:
        valid = validThirdScreen();
        if (valid) {
          const success = await doRegister();
          if (!success) {
            return;
          }
        }
        break;
      case 3:
        if (imageSource) {
          await savePhoto();
        }
        navigation.replace("Home");
        return;
      default:
        break;
    }
    if (valid) {
      setCurrentPosition((prev) => Math.min(prev + 1, labels.length - 1));
    }
  };

  const renderStepContent = () => {
    switch (currentPosition) {
      case 0:
        return <SignInScreen user={user} setUser={setUser} />;
      case 1:
        return <SignInPetScreen user={user} data={data} setData={setData} />;
      case 2:
        return <SignInPetInfoScreen pet={data} setData={setData} user={user} />;
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
      <View style={styles.headerNavigation}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="chevron-left" size={45} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.stepContent}>{renderStepContent()}</View>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentPosition}
        labels={labels}
        stepCount={4}
        onPress={(position) => {
          if (position < currentPosition) {
            setCurrentPosition(position);
          }
        }}
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
      </View>
    </View>
  );
};

export default UserStepsRegister;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondaryColor,
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "ios" ? 45 : 25,
    paddingBottom: 20,
  },
  headerNavigation: {
    width: "100%",
    height: 45,
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  backButton: {
    width: 60,
    height: 45,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  stepContent: {
    width: "100%",
    flex: 1,
    marginBottom: 10,
  },
  buttonsContainer: {},
  button: {
    fontSize: 16,
    color: "#007bff",
  },
  buttonNext: {
    marginTop: 20,
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
