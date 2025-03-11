import React, { useState } from "react";
import {
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";

import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";

import AppStorage from "../modules/AppStorage";
import { Colors } from "../styles/Colors";
import { clearUser, setUserInfo } from "../redux/slice/userSlice";
import Loading from "../components/Loading";
import WithoutPhoto from "../components/WithoutPhoto";
import ImageOption from "../components/ImageOption";
import * as ImagePicker from "expo-image-picker";
import { clearPetInfo } from "../redux/slice/petSlice";
import { View, Text, TouchableOpacity, Image } from "react-native-ui-lib";
import { useGetProfileQuery, useUpdatePictureProfileMutation, useUpdateUserMutation } from "../api/tobiApi/user";
import EditUserProfileForm from "../components/user/EditUserProfileForm";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

const ProfileEditUser = ({ route, navigation }: BottomTabScreenProps<any, any>) => {

  const [userDataForm, setUserDataForm] = useState({
    name: undefined,
    email: undefined,
    phone: undefined
  });

  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSource, setImageSource] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [permissionsRequested, setPermissionsRequested] = useState({
    camera: false,
    library: false,
  });

  const appStorage = new AppStorage();
  const dispatch = useDispatch();
  const [updatePictureProfile] = useUpdatePictureProfileMutation()
  const [updateUser] = useUpdateUserMutation()
  const {
    data: userProfileResponse,
    error: errorFetchingProfile,
    refetch: refetchProfile,
    isLoading: isLoadingFetchingProfile
  } = useGetProfileQuery(undefined)

  if (errorFetchingProfile) {
    Toast.show({
      type: "error",
      text1: "Ha ocurrido un error",
      text2: `Inténtalo de nuevo más tarde`,
    });
  }

  const getPermissionsLibrary = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
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
        text2: `Ha ocurrido un error al cargar la foto`,
        text1: `Puedes continuar y después agregar una foto`,
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
        text2: `Ha ocurrido un error al tomar la foto`,
        text1: `Puedes continuar y después agregar una foto`,
      });
      console.log("Error: ", error);
    }
  };

  const closeModal = () => setModalVisible(false);

  const savePhoto = async () => {
    try {
      const formData = new FormData();
      formData.append("picture", {
        uri: imageSource?.uri,
        type: "image/jpeg",
        name: imageSource?.fileName,
      });

      const { error } = await updatePictureProfile(formData);
      if (!error) {
        const { data: user } = await refetchProfile()
        if (user) {
          await appStorage.saveUser(user.data);
        }
      } else        
        Toast.show({
          type: "error",
          text2: `Ocurrió un error al guardar la foto`,
          text1: `Intente de nuevo más tarde`,
        });
        
    } catch (error) {
      console.log("Ocurrió un error: ", error);
    }
  };

  const onSubmit = async () => {
    setLoadData(true);
    try {
      imageSource && savePhoto();

      const { data: response, error } = await updateUser(userDataForm);
      if (!error) {
        dispatch(setUserInfo(response.data));
        Toast.show({
          type: "success",
          text1: "Guardado",
          text2: `Se actualizó tú información`,
        });
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error al guardar la data del usuario: ", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Usuario no actualizado`,
      });
    } finally {
      setLoadData(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await appStorage.clearStorage();
      dispatch(clearUser());
      dispatch(clearPetInfo());
      navigation.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    } catch (error) {
      console.log(error);     
      Toast.show({
        type: "error",
        text1: "Error al cerrar sesión",
        text2: `Inténtelo de nuevo más tarde`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {(isLoadingFetchingProfile || loading) && (
        <Loading textColor={Colors.white} backgroundColorProp={Colors.white} />
      )}
      <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1, flexDirection: "column" }}
            behavior={"height"}
            enabled
          >
            <View
              style={{
                backgroundColor: Colors.white,
                marginTop: Platform.OS == "android" ? "5%" : undefined,
              }}
            >
              <View
                row
                center
                height={50}
                marginT-10
              >
                <Text
                  center
                  text65M
                  color={Colors.black}

                >
                  Edición de perfil
                </Text>
                <TouchableOpacity
                  backgroundColor={Colors.danger}
                  center
                  marginR-10
                  style={{
                    borderRadius: 32,
                    height: "100%",
                    width: 80,
                    position: "absolute",
                    right: 0
                  }}
                  onPress={onSubmit}
                >
                  {loadData ? (
                    <ActivityIndicator size={"small"} color={Colors.white} />
                  ) : (
                    <Text
                      text70BO
                      color={Colors.white}
                    >
                      Listo
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View
                row
                center
                paddingH-25
              >

                {userProfileResponse?.data?.picture ? (
                  <Image
                    width={120}
                    height={120}
                    marginT-15
                    source={
                      imageSource
                        ? { uri: imageSource.uri }
                        : { uri: userProfileResponse.data.picture }
                    }
                    style={{ borderRadius: 60, overflow: "hidden" }}
                    resizeMode={"cover"}
                  />
                ) : (
                  <WithoutPhoto />
                )}

              </View>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
                centerH
              >
                <Text marginT-10 marginB-5 text80M color={Colors.black}>
                  Editar foto
                </Text>
              </TouchableOpacity>

              <EditUserProfileForm
                values={{
                  name: userDataForm.name ?? userProfileResponse?.data?.name,
                  email: userDataForm.email ?? userProfileResponse?.data?.email,
                  phone: userDataForm.phone ?? userProfileResponse?.data?.phone
                }}
                onChange={(field, value) => {
                  setUserDataForm({
                    ...userDataForm,
                    [field]: value
                  })
                }}
              />
            </View>
          </KeyboardAvoidingView>
          <View center paddingB-15>
            <TouchableOpacity
              row
              spread
              marginB-10
              style={{ width: "90%" }}
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <Text color={Colors.primaryColor}>Cambiar contraseña</Text>
              <Image
                source={require("../assets/arrowRigth.png")}
                width={15}
                height={15}
                resizeMode={"contain"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              row
              spread
              marginV-10
              style={{ width: "90%" }}
              onPress={logout}
            >
              <Text color={Colors.primaryColor}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <ImageOption
          visible={modalVisible}
          closeModal={closeModal}
          selectImageFromLibrary={getPermissionsLibrary}
          takePhoto={getPermissionsCamera}
        />
      </SafeAreaView>
    </>
  );
};

export default ProfileEditUser;