import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../styles/Colors";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import AppStorage from "../../modules/AppStorage";
import ImageOption from "../../components/ImageOption";
import ApiFetcher from "../../modules/ApiFetcher";
import * as ImagePicker from "expo-image-picker";
import ViewLoading from "../../components/ViewLoading";
import Toast from "react-native-toast-message";
import { AnimatedImage, LoaderScreen } from "react-native-ui-lib";

const EditMyPet = ({ route }) => {
  const { id, refreshData } = route.params;

  const navigation = useNavigation();
  const appStorage = new AppStorage();

  const [petInfo, setPetInfo] = useState({
    name: "",
    last_name: " ",
    food_brand: 0,
    age: 0,
    type_food: 1,
    weight: 0,
    picture: "",
    sterilized: false,
  });
  const [weightInput, setWeightInput] = useState("");

  const [loadData, setLoadData] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSource, setImageSource] = useState(null);
  const [permissionsRequested, setPermissionsRequested] = useState({
    camera: false,
    library: false,
  });

  const apiFetcher = new ApiFetcher();

  useEffect(() => {
    getPetInfo();
  }, []);

  const getPermissionsCamera = async () => {
    closeModal();
    let { status } = await ImagePicker.getCameraPermissionsAsync();
    
    if (status !== "granted") {
      const req = await ImagePicker.requestCameraPermissionsAsync();
      status = req.status;
    }
    
    if (status === "granted") {
      takePhoto();
    } else {
      Toast.show({
        type: "error",
        text2: `Permisos insuficientes.`,
        text1: `Se necesitan permisos para acceder a la cámara.`,
      });
    }
  };

  const requestLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      closeModal();
      Toast.show({
        type: "error",
        text2: `Se necesitan permisos para acceder a la biblioteca de imágenes.`,
        text1: `Habilita los permisos desde la configuración.`,
      });
    } else {
      getPermissionsLibrary();
    }
  };

  const getPermissionsLibrary = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    console.log("status: ", status);
    if (status !== "granted") {
      if (!permissionsRequested.library) {
        setPermissionsRequested((prev) => ({ ...prev, library: true }));
        await requestLibraryPermissions();
      }
      closeModal()
      Toast.show({
        type: "error",
        text2: `Se necesitan permisos para acceder a la biblioteca de imágenes.`,
        text1: `Habilita los permisos desde la configuración.`,
      });
    } else {
      selectImageFromLibrary();
    }
  };
 
  const getPetInfo = async () => {
    setLoadData(true);
    try {
      const response = await apiFetcher.getPetById(id);
      if (response.code == 200) {
        setPetInfo(response.data);
        if (response.data?.weight) {
          setWeightInput((Number(response.data.weight) / 1000).toString());
        }
      } else console.log("Algo salió mal");
    } catch (error) {
      console.log("Error: ", error);
      Toast.show({
        type: "error",
        text1: "No se pudo cargar la foto",
        text2: `Inténtalo de nuevo más tarde`,
      });
      navigation.goBack();
    } finally {
      setLoadData(false);
    }
  };

  const selectImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        console.log("result; ", result.assets[0]);
        setImageSource(result.assets[0]);
        closeModal();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "No se pudo cargar la foto",
        text2: `Inténtalo de nuevo más tarde`,
      });
      console.log("Error: ", error);
    }
  };

  const requestPermissionsCamera = async () => {
    // Unused
    getPermissionsCamera();
  };

  const takePhoto = async () => {
    console.log("llego a takephoto");
    try {
      console.log("entro al try");
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      console.log("RESULT ", result);
      if (!result.canceled) {
        setImageSource(result.assets[0]);
        closeModal();
      }
    } catch (error) {
      // Toast.show({
      //   type: "error",
      //   text1: "No se pudo tomar la foto",
      //   text2: `Inténtalo de nuevo más tarde`,
      // });
      console.error("Error: ", error);
    }
  };

  const closeModal = () => setModalVisible(false);

  const savePhoto = async () => {
    try {
      const formData = new FormData();
      formData.append("picture", {
        uri: imageSource.uri,
        type: "image/jpeg",
        name: imageSource.fileName || imageSource.uri.split("/").pop() || "photo.jpg",
      });
      console.log("formdata: ", formData._parts);
      const response = await apiFetcher.updatePicturePet(id, formData);
      console.log("Response: ", response);
      if (response.code == 200) {
        const user = await apiFetcher.getProfile();
        await appStorage.saveUser(user.data);
      } else
        Toast.show({
          type: "error",
          text1: "Ocurrió un error al guardar la foto",
          text2: `Inténtalo de nuevo más tarde`,
        });
    } catch (error) {
      console.log("Ocurrió un error: ", error);
    }
  };

  const updatePet = async () => {
    setLoadData(true);
    try {
      imageSource && (await savePhoto());
      const response = await apiFetcher.updatePet(id, petInfo);
      if (response.code == 200) {
        Toast.show({
          type: "success",
          text1: "Guardado",
          text2: `Se actualizó la información de ${response.data.name}`,
        });
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Mascota no actualizada`,
      });
    } finally {
      setLoadData(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
      >
        <View style={styles.headerContainer}>
          <View style={{ width: "33%" }} />
          <Text style={styles.headerTitle}>Edición de perfil</Text>
          <View
            style={{
              width: "33%",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              style={[
                styles.readyButton,
                (petInfo.name == "" || petInfo.weight == 0) && {
                  backgroundColor: "gray",
                },
              ]}
              onPress={updatePet}
              disabled={petInfo.name == ""}
            >
              {loadData ? (
                <ActivityIndicator size={"small"} color={Colors.white} />
              ) : (
                <Text style={styles.textButton}>Listo</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.imageContainer}>
          <View>
            <AnimatedImage
              source={
                imageSource
                  ? { uri: imageSource.uri }
                  : { uri: petInfo.picture }
              }
              style={styles.image}
              resizeMode={"cover"}
              loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
              animationDuration={500}
            />
          </View>
        </View>
        <View style={styles.photoContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.textInfo}>
              {petInfo.picture
                ? "Editar foto de perfil"
                : "Agregar foto de perfil"}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{ padding: 15 }}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              placeholderTextColor="#000"
              style={styles.textInput}
              value={petInfo.name}
              onChangeText={(text) => setPetInfo({ ...petInfo, name: text })}
            />
            <Text style={styles.label}>Peso de tu mascota (Kg)</Text>
            <TextInput
              keyboardType="numeric"
              placeholderTextColor="#000"
              style={styles.textInput}
              value={weightInput}
              onChangeText={(value) => {
                setWeightInput(value);
                setPetInfo({ ...petInfo, weight: value ? (Number(value) * 1000).toString() : "0" });
              }}
            />
            <View elevation={5} style={[styles.textInput, { marginTop: "5%" }]}>
              <View style={{ flexDirection: "row" }}>
                <BouncyCheckbox
                  value={true}
                  size={20}
                  fillColor="#EF4136"
                  iconStyle={{ borderColor: "red" }}
                  innerIconStyle={{ borderWidth: 2 }}
                  textStyle={{
                    fontSize: 16,
                    fontWeight: "400",
                    color: "#000",
                  }}
                  onPress={(check) => {
                    setPetInfo({ ...petInfo, sterilized: check });
                  }}
                  isChecked={petInfo.sterilized}
                />
                <Text>¿Tu mascota está esterilizada?</Text>
              </View>
            </View>
          </View>
          {loadData && (
            <ViewLoading
              waitString="Guardando"
              backgroundColor={Colors.white}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <ImageOption
        visible={modalVisible}
        closeModal={closeModal}
        selectImageFromLibrary={getPermissionsLibrary}
        takePhoto={getPermissionsCamera}
      />
    </SafeAreaView>
  );
};

export default EditMyPet;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingTop: 20,
  },
  photoContainer: {
    alignItems: "center",
  },
  label: {
    marginBottom: 5,
    marginTop: 15,
    fontWeight: "400",
    fontSize: 13,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  textInput: {
    height: 60,
    width: "100%",
    paddingLeft: 20,
    justifyContent: "center",
    backgroundColor: "#D6EFFF",
    borderRadius: 4,
  },
  textInfo: {
    fontSize: 14,
    color: "black",
    fontWeight: "300",
  },
  checkbox: {
    marginTop: "8%",
    //flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  readyButton: {
    backgroundColor: "#EF4136",
    borderRadius: 32,
    justifyContent: "center",
    height: 50,
    width: 80,
    alignItems: "center",
    marginRight: 10,
  },
  textButton: {
    fontSize: 16,
    color: "white",
    fontWeight: "700",
  },
  headerTitle: {
    textAlign: "center",
    width: "34%",
    fontWeight: "500",
    fontSize: 17,
    color: "#000",
  },
  image: {
    height: 120,
    width: 120,
    zIndex: 0,
    borderRadius: 60,
    overflow: "hidden",
  },
  imageContainer: {
    height: "20%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 25,
  },
});
