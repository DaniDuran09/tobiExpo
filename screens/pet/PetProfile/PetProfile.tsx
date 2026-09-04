import React, { useState, useEffect } from "react";
import { Platform, ScrollView, TextInput } from "react-native";
import { View, Text, Button, TouchableOpacity } from "react-native-ui-lib";
import { Avatar, RadioButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../../styles/Colors";
import * as ImagePicker from "expo-image-picker";
import Loading from "../../../components/Loading";
import Toast from "react-native-toast-message";
import ApiFetcher from "../../../modules/ApiFetcher";
import { useGetPetByIdQuery } from "../../../services/api/pets.api";
import DeleteModal from "../../../components/DeleteModal";
import ImageOption from "../../../components/ImageOption";

const PetProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params as { item: Pet };

  const [selectedPet, setSelectedPet] = useState<Pet>(item);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [petInfo, setPetInfo] = useState({
    name: item?.name || "",
    weight: item?.weight || 0,
    sterilized: item?.sterilized ?? false,
  });
  const [weightInput, setWeightInput] = useState<string>(
    item?.weight ? (Number(item.weight) / 1000).toString() : ""
  );
  const [loadData, setLoadData] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState<any>(null);
  const [permissionsRequested, setPermissionsRequested] = useState<{
    camera: boolean;
    library: boolean;
  }>({
    camera: false,
    library: false,
  });
  const apiFetcher = new ApiFetcher();

  useEffect(() => {
    getPetInfo();
  }, []);

  const getPetInfo = async () => {
    setLoadData(true);
    try {
      const response = await apiFetcher.getPetById(selectedPet.id);
      if (response.code == 200) {
        setPetInfo(response.data);
        if (response.data?.weight) {
          setWeightInput((Number(response.data.weight) / 1000).toString());
        }
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

  const deletePet = async (id: number) => {
    setLoadData(true);
    try {
      const response = await apiFetcher.deletePet(id);
      if (response.code === 200) {
        console.log("first");
        Toast.show({
          type: "success",
          text1: "Mascota eliminada con éxito",
          text2: `Eliminamos a ${selectedPet.name} de tu lista de mascotas`,
        });
        setShowDeleteModal(false);
        navigation.goBack();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al intentar eliminar a la mascota",
        text2: "Intenta de nuevo más tarde",
      });
      console.error(error);
      setShowDeleteModal(false);
    } finally {
      setLoadData(false);
    }
  };

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

  const selectImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
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

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        console.log("result", result.assets[0])
        setImageSource(result.assets[0]);
        closeModal();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text2: `Error al tomar la foto`,
        text1: `Puedes continuar sin cargar la foto`,
      });
      console.log("Error: ", error);
    }
  };

  const closeModal = () => setModalVisible(false);

  const requestPermissionsCamera = async () => {
    // Unused now, but kept to prevent breaking other calls
    getPermissionsCamera();
  };

  const savePhoto = async () => {
    try {
      const formData = new FormData();
      formData.append("picture", {
        uri: imageSource.uri,
        type: "image/jpeg",
        name: imageSource.fileName || imageSource.uri.split("/").pop() || "photo.jpg",
      });

      const response = await apiFetcher.updatePicturePet(
        selectedPet.id,
        formData
      );
      if (response.code === 200) {
        console.log("TODO BIEN")
        return true;
      } else {
        Toast.show({
          type: "error",
          text1: `Error al cargar la foto`,
          text2: `Intenta de nuevo más tarde`,
        });
        return false;
      }
    } catch (error) {
      console.log("Ocurrió un error: ", error);
      Toast.show({
        type: "error",
        text1: `Error al guardar la foto`,
        text2: `Intenta de nuevo más tarde`,
      });
      return false;
    }
  };

  const rawGender = selectedPet?.pet_breed?.life_stages?.[0]?.gender;
  const petGender =
    rawGender === "male"
      ? "Macho"
      : rawGender === "female"
      ? "Hembra"
      : "Sin especificar";
  const updatePet = async () => {
    setLoadData(true);
    try {
      const response = await apiFetcher.updatePet(selectedPet.id, petInfo);
      if (imageSource) {
        const saved = await savePhoto();
        if (!saved) {
          return;
        }
      }

      if (response.code === 200) {
        Toast.show({
          type: "success",
          text1: "Guardado",
          text2: `Se actualizó la información de ${response.data.name}`,
        });
        getPetInfo();
        // navigation.goBack();
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

  return (
    <ScrollView style={{ backgroundColor: Colors.white }}>
      <View flex spread bg-white>
        {loadData && (
          <Loading
            backgroundColorProp={Colors.white}
            textColor={Colors.primaryColor}
          />
        )}
        <View
          row
          padding-20
          paddingT-0
          style={{ borderBottomWidth: 1, borderBottomColor: Colors.secondGray }}
        >
          <View center>
            <Avatar.Image
              source={
                imageSource
                  ? { uri: imageSource.uri }
                  : { uri: selectedPet.picture }
              }
              size={100}
            />
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text text80 color={Colors.gray} marginT-10>
                Editar foto
              </Text>
            </TouchableOpacity>
          </View>

          <View marginL-10 centerV>
            <Text text40BL>{petInfo.name}</Text>
            <Text text80L color={Colors.gray} marginT-5>
              {`${selectedPet?.age} años | ${petGender} | ${selectedPet.pet_breed.description}`}
            </Text>
          </View>
        </View>

        <View marginL-20>
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
            Peso de tu mascota (Kg)
          </Text>
          <TextInput
            placeholder="Peso en Kg"
            keyboardType="numeric"
            placeholderTextColor="#000"
            elevation={5}
            value={weightInput}
            onChangeText={(text) => {
              setWeightInput(text);
              setPetInfo({ ...petInfo, weight: text ? (Number(text) * 1000) : 0 });
            }}
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
              <Text marginL-10>¿Tu mascota está esterilizada?</Text>
            </View>
          </View>

          <View row marginT-20 width={"90%"} spread centerV>
            <TouchableOpacity
              row
              centerV
              gap-5
              onPress={() => setShowDeleteModal(true)}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={24}
                color={Colors.gray}
              />
              <Text color={Colors.gray}>Eliminar mascota</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={updatePet}
              backgroundColor={Colors.primaryColor}
              paddingH-20
              paddingV-10
              br20
              row
              center
            >
              <Text color={Colors.white}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View marginB-15>
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
                style={{ borderBottomWidth: 0.5 }}
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
            <TouchableOpacity
              onPress={() => navigation.navigate("PetPdf",{ pet: selectedPet})}
            >
              <View
                row
                spread
                centerV
                paddingV-15
                width={"100%"}
                style={{ borderBottomWidth: 0.5 }}
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
        </View>
        <ImageOption
          visible={modalVisible}
          closeModal={closeModal}
          selectImageFromLibrary={getPermissionsLibrary}
          takePhoto={getPermissionsCamera}
        />
        <DeleteModal
          visible={showDeleteModal}
          closeModal={() => setShowDeleteModal(false)}
          deletePet={() => deletePet(selectedPet.id)}
        />
      </View>
    </ScrollView>
  );
};

export default PetProfile;
