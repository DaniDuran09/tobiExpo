import React, { useEffect, useState } from "react";
import {
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import AppStorage from "../../modules/AppStorage";
import { Colors } from "../../styles/Colors";
import { clearUser, setUserInfo } from "../../redux/slice/userSlice";
import ApiFetcher from "../../modules/ApiFetcher";
import Loading from "../../components/Loading";
import WithoutPhoto from "../../components/WithoutPhoto";
import ImageOption from "../../components/ImageOption";
import * as ImagePicker from "expo-image-picker";
import { View, Text, Image } from "react-native-ui-lib";
import { StackNavigationProp } from "@react-navigation/stack";

type ProfileEditUserProps = {
  route: any;
  navigation: StackNavigationProp<any, any>;
};

type UserData = {
  name: string;
  email: string;
  phone: string;
  cp: string;
  picture?: string;
};

const ProfileEditUser: React.FC<ProfileEditUserProps> = ({ navigation }) => {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    cp: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [loadData, setLoadData] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [imageSource, setImageSource] = useState<any>(null);
  const [permissionsRequested, setPermissionsRequested] = useState<{
    camera: boolean;
    library: boolean;
  }>({
    camera: false,
    library: false,
  });

  const appStorage = new AppStorage();
  const apiFetcher = new ApiFetcher();
  const dispatch = useDispatch();

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiFetcher.getProfile();
      if (response) setUserData(response.data);
    } catch (e) {
      console.log("Error: ", e);
      Toast.show({
        type: "error",
        text1: "Ha ocurrido un error",
        text2: `Inténtalo de nuevo más tarde`,
      });
    } finally {
      setLoading(false);
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

      const response = await apiFetcher.updatePictureProfile(formData);
      if (response.code === 200) {
        const user = await apiFetcher.getProfile();
        await appStorage.saveUser(user.data);
      } else {
        Toast.show({
          type: "error",
          text2: `Error`,
          text1: `Error al cargar la foto`,
        });
      }
    } catch (error) {
      console.log("Ocurrió un error: ", error);
    }
  };

  const onSubmit = async () => {
    setLoadData(true);
    try {
      imageSource && savePhoto();

      const newData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        cp: userData.cp,
      };

      const response = await apiFetcher.updateUser(newData);
      if (response.code === 200) {
        dispatch(setUserInfo(response.data));
        Toast.show({
          type: "success",
          text1: "Guardado",
          text2: `Se actualizó tu información`,
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

  return (
    <>
      {loading && (
        <Loading textColor={Colors.white} backgroundColorProp={Colors.white} />
      )}
      <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1, flexDirection: "column" }}
            behavior={"height"}
            enabled
          >
            <View backgroundColor={Colors.white}
              style={{
                marginTop: Platform.OS === "android" ? "5%" : 0,
              }}
            >
              <View width={'100%'} center row paddingH-25
              >
                <View>
                  {userData.picture ? (
                    <Image
                      source={
                        imageSource
                          ? { uri: imageSource.uri }
                          : { uri: userData.picture }
                      }
                      style={{
                        height: 120,
                        width: 120,
                        zIndex: 0,
                        borderRadius: 60,
                        overflow: "hidden",
                        marginTop: 15,
                      }}
                      resizeMode={"cover"}
                    />
                  ) : (
                    <WithoutPhoto />
                  )}
                </View>
              </View>
              <View center>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                  }}
                >
                  <Text marginB-5 marginT-20 text80>
                    Editar foto
                  </Text>
                </TouchableOpacity>
              </View>
              <View width={'100%'} marginL-20>
                <Text marginB-5 marginT-20 text80>
                  Nombre
                </Text>
                <TextInput
                  placeholder="Nombre"
                  placeholderTextColor="#000"
                  elevation={5}
                  value={userData.name}
                  style={[
                    {
                      color: "#000",
                      height: 60,
                      width: "90%",
                      paddingLeft: 20,
                      justifyContent: "center",
                      backgroundColor: "#D6EFFF",
                      borderRadius: 4,
                    },
                  ]}
                  autoCapitalize="none"
                  onChangeText={(val) =>
                    setUserData({ ...userData, name: val })
                  }
                />
                <Text marginB-5 marginT-10 text80>
                  Correo
                </Text>

                <TextInput
                  placeholder="Correo electronico"
                  elevation={5}
                  value={userData.email}
                  placeholderTextColor="#000"
                  style={[
                    {
                      color: "#000",
                      height: 60,
                      width: "90%",
                      paddingLeft: 20,
                      justifyContent: "center",
                      backgroundColor: "#D6EFFF",
                      borderRadius: 4,
                    },
                  ]}
                  autoCapitalize="none"
                  onChangeText={(val) =>
                    setUserData({ ...userData, email: val })
                  }
                />
                <Text marginB-5 marginT-10 text80>
                  Teléfono
                </Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Telefono"
                  elevation={5}
                  value={userData.phone}
                  placeholderTextColor="#000"
                  maxLength={10}
                  style={[
                    {
                      color: "#000",
                      height: 60,
                      width: "90%",
                      paddingLeft: 20,
                      justifyContent: "center",
                      backgroundColor: "#D6EFFF",
                      borderRadius: 4,
                    },
                  ]}
                  autoCapitalize="none"
                  onChangeText={(val) =>
                    setUserData({ ...userData, phone: val })
                  }
                />
                <Text marginB-5 marginT-10 text80>
                  Código postal
                </Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Código postal"
                  elevation={5}
                  value={userData.cp}
                  placeholderTextColor="#000"
                  maxLength={10}
                  style={[
                    {
                      color: "#000",
                      height: 60,
                      width: "90%",
                      paddingLeft: 20,
                      justifyContent: "center",
                      backgroundColor: "#D6EFFF",
                      borderRadius: 4,
                    },
                  ]}
                  autoCapitalize="none"
                  onChangeText={(val) => setUserData({ ...userData, cp: val })}
                />
              </View>
              <View row right marginT-20 paddingR-20>
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.primaryColor,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                  }}
                  onPress={onSubmit}
                >
                  <Text color={Colors.white} text80>
                    Actualizar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
          <View center paddingB-15></View>
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
