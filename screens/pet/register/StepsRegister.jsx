import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import StepIndicator from "react-native-step-indicator";
import { Colors } from "../../../styles/Colors";
import { customStyles } from "../../../styles/GlobalStyles";
import RegisterNewPet from "./RegisterNewPet";
import SecondScreenRegisterPet from "./SecondScreenRegisterPet";
import { useDispatch, useSelector } from "react-redux";
import FinalScreenRegisterPet from "./FinalScreenRegisterPet";
import ApiFetcher from "../../../modules/ApiFetcher";
import { setPetInfo } from "../../../redux/slice/petSlice";
import { formatDateToDDMMYYYY } from "../../../utils/scripts";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const StepsRegister = () => {
  const labels = ["1", "2", "3"];
  const [currentPosition, setCurrentPosition] = useState(0);
  const [imageSource, setImageSource] = useState(null);
  const [pet, setPet] = useState(1);
  const petInfo = useSelector((store) => store.pet.info);
  const picturePet = useSelector((store) => store.pet.picture);
  const [idPet, setIdPet] = useState(0);
  const [loading, setLoading] = useState(false);

  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation();

  const savePet = async () => {
    setLoading(true);
    try {
      const response = await apiFetcher.registerPet(petInfo);
      if (response.code == 200) {
        setIdPet(response.data.id);
      } else {
        console.log("Algo malo paso");
      }
    } catch (error) {
      console.log("Ocurrió un error: ", error);
      navigation.reset({
        index: 0,
        routes: [{ name: "Profile" }],
      }),
        Toast.show({
          type: "error",
          text1: "Ocurrió un error al guardar la mascota",
          text2: `Inténtelo de nuevo más tarde`,
        });
    } finally {
      setLoading(false);
    }
  };

  const updatePicturePet = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("picture", {
        uri: picturePet.uri,
        type: "image/jpeg",
        name: picturePet.fileName,
      });
      const response = await apiFetcher.updatePicturePet(idPet, formData);
    } catch (error) {
      console.log("Ocurrió un error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const finalScreen = () => {
    navigation.navigate("Success", {
      text: "Nueva mascota añadida con éxito",
      action: () =>
        navigation.reset({
          index: 0,
          routes: [{ name: "Profile" }],
        }),
    });
  };

  const nextStep = async (step) => {
    switch (step) {
      case 0:
        if (petInfo.name.length > 1 && petInfo.birthday != "")
          setCurrentPosition((prev) => Math.min(prev + 1, labels.length - 1));
        else
          Toast.show({
            type: "error",
            text1: "Datos incompletos",
            text2: `Por favor complete todos los campos`,
          });
        break;
      case 1:
        if (petInfo.pet_breed_id != 0 && petInfo.weight != 0) {
          await savePet();
          setCurrentPosition((prev) => Math.min(prev + 1, labels.length - 1));
        } else
          Toast.show({
            type: "error",
            text1: "Datos incompletos",
            text2: `Por favor complete todos los campos`,
          });
        break;
      case 2:
        await updatePicturePet();
        finalScreen();
        break;
      default:
        break;
    }
  };

  const renderStepContent = () => {
    switch (currentPosition) {
      case 0:
        return <RegisterNewPet pet={pet} setPet={setPet} />;
      case 1:
        return <SecondScreenRegisterPet pet={pet} />;
      case 2:
        return (
          <FinalScreenRegisterPet
            backgroundColor={Colors.white}
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
      <View
        style={{
          position: "absolute",
          bottom: "3%",
          width: "100%",
          justifyContent: "center",
          alignSelf: "center",
          backgroundColor: Colors.white,
        }}
      >
        <StepIndicator
          customStyles={customStyles}
          currentPosition={currentPosition}
          labels={labels}
          stepCount={3}
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.buttonNext}
            onPress={() => nextStep(currentPosition)}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size={"small"} />
            ) : (
              <Text style={styles.textNext}>
                {currentPosition != 2 ? "Siguiente" : "Guardar perfil"}
              </Text>
            )}
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
    </View>
  );
};

export default StepsRegister;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: 15,
  },
  stepContent: {
    backgroundColor: "red",
    width: "100%",
    height: "70%",
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
