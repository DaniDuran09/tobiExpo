import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { View, Text, Button, Image } from "react-native-ui-lib";
import { RadioButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../../styles/Colors";
import Loading from "../../../components/Loading";
import Toast from "react-native-toast-message";
import ApiFetcher from "../../../modules/ApiFetcher";
import WithoutPhoto from "../../../components/WithoutPhoto";
import ImageOption from "../../../components/ImageOption";
import * as ImagePicker from "expo-image-picker";
import DeleteModal from "../../../components/DeleteModal";

const PetProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params as { item: Pet };
  const [selectedPet, setSelectedPet] = useState<Pet>(item);
  const [petInfo, setPetInfo] = useState({
    name: item?.name || "",
    weight: item?.weight || 0,
    sterilized: item?.sterilized ?? false,
  });
  const [loadData, setLoadData] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSource, setImageSource] = useState(null);
  const [showDeleteModal, setShowDeletModal] = useState(false);
  const [idItemSelected, setIdItemSelected] = useState(0);
  const [permissionsRequested, setPermissionsRequested] = useState({
    camera: false,
    library: false,
  });
  const apiFetcher = new ApiFetcher();

  const getPermissionsLibrary = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      if (!permissionsRequested.library) {
        setPermissionsRequested((prev) => ({ ...prev, library: true }));
        await requestLibraryPermissions();
      }
      closeModal();
      Toast.show({
        type: "error",
        text2: `Se necesitan permisos para acceder a la biblioteca de imágenes.`,
        text1: `Habilita los permisos desde la configuración.`,
      });
    } else {
      selectImageFromLibrary();
    }
  };
  const closeDeleteModal = () => {
    setShowDeletModal(false);
    setIdItemSelected(0);
  };

  const deletePet = async (id) => {
    try {
      const status = await apiFetcher.deletePet(id);
      console.log("IMPRIME EL STATUS", status);

      if (status.code === 200) {
        closeDeleteModal();
        Toast.show({
          type: "success",
          text1: "Eliminada",
          text2: "Mascota eliminada correctamente",
        });
        navigation.goBack();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text2: `Error`,
        text1: `Error al eliminar la mascota`,
      });
      console.error(error);
    }
  };

  const selectDeleteItem = (id) => {
    setIdItemSelected(id);
    setShowDeletModal(true);
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

  const selectImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageSource(result.assets[0]);
        closeModal();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text2: `Error`,
        text1: `Error al cargar la foto`,
      });
      console.log("Error: ", error);
    }
  };
  const getPermissionsCamera = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    if (status !== "granted") {
      if (!permissionsRequested.camera) {
        setPermissionsRequested((prev) => ({ ...prev, camera: true }));
        await requestPermissionsCamera();
      }
      Toast.show({
        type: "error",
        text2: `Permisos insuficientes.`,
        text1: `Se necesitan permisos para acceder a la cámara.`,
      });
    } else {
      takePhoto();
    }
  };
  const requestPermissionsCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      closeModal();
      Toast.show({
        type: "error",
        text2: `Permisos insuficientes.`,
        text1: `Se necesitan permisos para acceder a la cámara.`,
      });
    } else {
      getPermissionsCamera();
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        console.log("result: ", result);
        setImageSource(result.assets[0]);
        closeModal();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text2: `Error`,
        text1: `Error al cargar la foto`,
      });
      console.log("Error: ", error);
    }
  };

  const closeModal = () => setModalVisible(false);

  const { data: vaccineBrandsResponse, isLoading: isLoadingVaccineBrands } =
    useGetVaccinesQuery(selectedPet.id || idSelectedPet);
  const vaccineBrands = vaccineBrandsResponse?.data.vaccine_brands || [];
  const dewormersBrands = vaccineBrandsResponse?.data.dewormer_brands || [];

  useEffect(() => {
    getPetInfo();
  }, []);

  const getPetInfo = async () => {
    setLoadData(true);
    try {
      const response = await apiFetcher.getPetById(selectedPet.id);
      if (response.code == 200) {
        setPetInfo(response.data);
      } else {
        console.log("Algo salió mal");
      }
    } catch (error) {
      console.log("Error: ", error);
      Toast.show({
        type: "error",
        text1: "No se pudo cargar la información",
        text2: `Inténtalo de nuevo más tarde`,
      });
      navigation.goBack();
    } finally {
      setLoadData(false);
    }
  };
  const savePhoto = async () => {
    try {
      const formData = new FormData();
      formData.append("picture", {
        uri: imageSource.uri,
        type: "image/jpeg",
        name: imageSource.fileName,
      });

      const response = await apiFetcher.updatePicturePet(
        selectedPet.id,
        formData
      );

      if (response.code == 200) {
        setSelectedPet({ ...selectedPet, picture: imageSource.uri });

        Toast.show({
          type: "success",
          text1: "Foto actualizada",
          text2: "La foto de tu mascota se ha actualizado correctamente.",
        });
      } else {
        Toast.show({
          type: "error",
          text2: `Error`,
          text1: `Error al guardar la foto`,
        });
      }
    } catch (error) {
      console.log("Ocurrió un error: ", error);
    }
  };

  const updatePet = async () => {
    setLoadData(true);
    try {
      imageSource && savePhoto();
      const response = await apiFetcher.updatePet(selectedPet.id, petInfo);

      if (response.code === 200) {
        Toast.show({
          type: "success",
          text1: "Guardado",
          text2: `Se actualizó la información de ${response.data.name}`,
        });
        getPetInfo();
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error al actualizar mascota:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Mascota no actualizada",
      });
    } finally {
      setLoadData(false);
    }
  };

  if (loadData) {
    return (
      <Loading backgroundColor={Colors.white} textColor={Colors.primaryColor} />
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
      <ScrollView style={{ flex: 1, backgroundColor: Colors.white }}>
        <View
          padding-10
          row
          style={{
            shadowColor: Colors.gray,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <View center>
            {selectedPet?.picture ? (
              <Image
                height={120}
                width={120}
                borderRadius={60}
                source={
                  imageSource
                    ? { uri: imageSource.uri }
                    : { uri: selectedPet.picture }
                }
              />
            ) : (
              <WithoutPhoto />
            )}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Text text80 color={Colors.gray} marginT-10>
                Editar foto
              </Text>
            </TouchableOpacity>
          </View>

          <View marginL-10 centerV>
            <Text text40BL>{selectedPet?.name}</Text>
            <Text text80L color={Colors.gray} marginT-5>
              {`${selectedPet?.age} años | ${selectedPet?.pet_breed?.life_stages?.[0]?.gender} | ${selectedPet?.pet_breed.name}`}
            </Text>
          </View>
        </View>

        <View width={"100%"} marginL-20>
          <Text marginB-5 marginT-10 text80>
            Nombre
          </Text>
          <TextInput
            placeholder="Nombre"
            placeholderTextColor="#000"
            elevation={5}
            value={petInfo.name}
            onChangeText={(text) => setPetInfo({ ...petInfo, name: text })}
            style={{
              color: "#000",
              height: 60,
              width: "90%",
              paddingLeft: 20,
              justifyContent: "center",
              backgroundColor: "#D6EFFF",
              borderRadius: 4,
            }}
            autoCapitalize="none"
          />
          <Text marginB-5 marginT-20 text80>
            Peso de tu mascota
          </Text>
          <TextInput
            placeholder="Peso"
            placeholderTextColor="#000"
            elevation={5}
            value={petInfo.weight}
            onChangeText={(text) => setPetInfo({ ...petInfo, weight: text })}
            style={{
              color: "#000",
              height: 60,
              width: "90%",
              paddingLeft: 20,
              justifyContent: "center",
              backgroundColor: "#D6EFFF",
              borderRadius: 4,
            }}
            autoCapitalize="none"
          />
          <View
            marginT-20
            height={60}
            width={"90%"}
            paddingL-20
            backgroundColor="#D6EFFF"
            style={{
              justifyContent: "center",
              borderRadius: 4,
            }}
          >
            <View row centerV>
              <RadioButton.Android
                value="yes"
                status={petInfo.sterilized ? "checked" : "unchecked"}
                color={Colors.primaryColor}
                onPress={() =>
                  setPetInfo({ ...petInfo, sterilized: !petInfo.sterilized })
                }
              />
              <Text marginL-10 text80BL>
                ¿Tu mascota está esterilizada?
              </Text>
            </View>
          </View>

          <View
            row
            marginT-20
            width={"90%"}
            style={{ justifyContent: "space-between" }}
          >
            <View row center>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={24}
                color={Colors.gray}
              />
              <TouchableOpacity onPress={() => selectDeleteItem(item.id)}>
                <Text color={Colors.gray} marginL-5>
                  Eliminar mascota
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              backgroundColor={Colors.primaryColor}
              label="Actualizar"
              style={{ borderRadius: 10, padding: 10 }}
              onPress={updatePet}
            />
          </View>
        </View>

        <View paddingH-10>
          <View marginB-10>
            <Text text70BO marginT-5>
              MIS DOCUMENTOS
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("IdInfoPet", { pet: selectedPet })
            }
          >
            <View
              row
              spread
              centerV
              paddingV-15
              width={"100%"}
              style={{ borderBottomWidth: 0.2 }}
            >
              <View row gap-10 centerV marginL-10>
                <Icon name="qrcode" size={25} color={Colors.black} />
                <Text text70>ID digital de mi mascota</Text>
              </View>
              <View row gap-10 centerV>
                <Icon name="chevron-right" size={25} color={Colors.black} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              row
              spread
              centerV
              paddingV-15
              width={"100%"}
              style={{ borderBottomWidth: 0.2 }}
            >
              <View row gap-10 centerV marginL-10>
                <Icon
                  name="cards-playing-heart-outline"
                  size={25}
                  color={Colors.black}
                />
                <Text text70>Cartilla de vacunación</Text>
              </View>
              <View row gap-10 centerV>
                <Icon name="chevron-right" size={25} color={Colors.black} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ImageOption
        visible={modalVisible}
        closeModal={closeModal}
        selectImageFromLibrary={getPermissionsLibrary}
        takePhoto={getPermissionsCamera}
      />
      <DeleteModal
        visible={showDeleteModal}
        closeModal={closeDeleteModal}
        deletePet={() => deletePet(idItemSelected)}
      />
    </SafeAreaView>
  );
};

export default PetProfile;
