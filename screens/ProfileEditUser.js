import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";

import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";

import AppStorage from "../modules/AppStorage";
import { Colors } from "../styles/Colors";
import { clearUser, setUserInfo } from "../redux/slice/userSlice";
import ApiFetcher from "../modules/ApiFetcher";
import Loading from "../components/Loading";
import WithoutPhoto from "../components/WithoutPhoto";
import ImageOption from "../components/ImageOption";
import * as ImagePicker from "expo-image-picker";
import { clearPetInfo } from "../redux/slice/petSlice";
import { View } from "react-native-ui-lib";

const ProfileEditUser = ({ route, navigation }) => {
  // const { refreshData } = route.params;
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadData, setLoadData] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSource, setImageSource] = useState(null);

  const appStorage = new AppStorage();
  const apiFetcher = new ApiFetcher();
  const dispatch = useDispatch();

  /*useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso necesario",
          "Se requieren permisos para acceder a la galería"
        );
      }
    })();
  }, []);*/
  const getLibraryPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    console.log("STATUS LIBRARY", status);
    if (status !== "granted") {
      requestLibraryPermissions();
      Toast.show({
        type: "error",
        text2: `Permisos insuficientes.`,
        text1: `Se necesitan permisos para acceder a la biblioteca de imágenes.`,
      });
    } else selectImageFromLibrary();
  };
  const requestLibraryPermissions = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text2: `Permisos insuficientes.`,
        text1: `Se necesitan permisos para acceder a la biblioteca de imágenes.`,
      });
    } else getLibraryPermission();
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
        console.log("Resukt: ", result.assets[0]);
        setImageSource(result.assets[0]);
        closeModal();
      }
    } catch (error) {
      Alert.alert(
        "Ha ocurrido un error al cargar la foto",
        "Puedes continuar y después agregar una foto"
      );
      console.log("Error: ", error);
    }
  };
  const getCameraPermission = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    console.log("STATUS ", status);
    if (status !== "granted") {
      requestCameraPermissions();
      Toast.show({
        type: "error",
        text2: `Permisos insuficientes.`,
        text1: `Se necesitan permisos para acceder a la biblioteca de imágenes.`,
      });
    } else takePhoto();
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text2: `Permisos insuficientes.`,
        text1: `Se necesitan permisos para acceder a la biblioteca de imágenes.`,
      });
    } else getCameraPermission();
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
      Alert.alert(
        "Ha ocurrido un error al tomar la foto",
        "Puedes continuar y después agregar una foto"
      );
      console.log("Error: ", error);
    }
  };

  const closeModal = () => setModalVisible(false);

  React.useEffect(() => {
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
      console.log("imageSource: ", imageSource);
      const formData = new FormData();
      formData.append("picture", {
        uri: imageSource.uri,
        type: "image/jpeg",
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

  const onSubmit = async () => {
    setLoadData(true);
    try {
      imageSource && savePhoto();

      const newData = {
        name: userData.name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone,
        birthday: userData.birthday,
        age: userData.age,
      };

      console.log("que");
      const response = await apiFetcher.updateUser(newData);
      console.log("La respuesta: ", response);
      if (response.code == 200) {
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
      Alert.alert("Error al cerrar sesión", "Inténtelo de nuevo más tarde");
    } finally {
      setLoading(false);
    }
  };

  console.log("imageSource.uri: ", imageSource);

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
            <View
              style={{
                backgroundColor: "#fff",
                marginTop: Platform.OS == "android" && "5%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <View style={{ width: "33%" }} />
                <Text
                  style={{
                    textAlign: "center",
                    width: "34%",
                    fontWeight: "500",
                    fontSize: 17,
                    color: "#000",
                  }}
                >
                  Edición de perfil
                </Text>
                <View
                  style={{
                    width: "33%",
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#EF4136",
                      borderRadius: 32,
                      justifyContent: "center",
                      height: 50,
                      width: 80,
                      marginRight: 10,
                      alignItems: "center",
                    }}
                    onPress={onSubmit}
                  >
                    {loadData ? (
                      <ActivityIndicator size={"small"} color={Colors.white} />
                    ) : (
                      <Text
                        style={{
                          fontSize: 16,
                          color: "white",
                          fontWeight: "700",
                        }}
                      >
                        Listo
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: 25,
                }}
              >
                <View>
                  {userData.picture ? (
                    <Image
                      source={
                        imageSource
                          ? { uri: imageSource.uri }
                          : { uri: userData.picture }
                      }
                      style={styles.image}
                      resizeMode={"cover"}
                    />
                  ) : (
                    <>
                      <WithoutPhoto />
                    </>
                  )}
                </View>
              </View>
              <View style={styles.containerEditPhoto}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                  }}
                >
                  <Text style={[styles.label, { marginTop: 10 }]}>
                    Editar foto
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: "100%", marginLeft: "5%" }}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  placeholder="Nombre"
                  placeholderTextColor="#000"
                  elevation={5}
                  value={userData.name}
                  style={[
                    styles.textInput,
                    {
                      color: "#000",
                    },
                  ]}
                  autoCapitalize="none"
                  onChangeText={(val) =>
                    setUserData({ ...userData, name: val })
                  }
                />
                <Text style={styles.label}>Correo</Text>

                <TextInput
                  placeholder="Correo electronico"
                  elevation={5}
                  value={userData.email}
                  placeholderTextColor="#000"
                  style={[
                    styles.textInput,
                    {
                      color: "#000",
                    },
                  ]}
                  autoCapitalize="none"
                  onChangeText={(val) =>
                    setUserData({ ...userData, email: val })
                  }
                />
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="Telefono"
                  elevation={5}
                  value={userData.phone}
                  placeholderTextColor="#000"
                  maxLength={10}
                  style={[
                    styles.textInput,
                    {
                      color: "#000",
                    },
                  ]}
                  autoCapitalize="none"
                  onChangeText={(val) =>
                    setUserData({ ...userData, phone: val })
                  }
                />
              </View>
            </View>
          </KeyboardAvoidingView>
          <View center paddingB-15>
            {/* <TouchableOpacity
                  style={styles.changeButton}
                  onPress={() => navigation.navigate('MyCards')}>
                  <Text style={styles.changePassword}>Mis tarjetas</Text>
                  <Image
                    source={require('../assets/arrowRigth.png')}
                    style={{height: 15, width: 15}}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.changeButton}
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <Text style={styles.changePassword}>Cambiar contraseña</Text>
              <Image
                source={require("../assets/arrowRigth.png")}
                style={{ height: 15, width: 15 }}
                resizeMode={"contain"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.changeButton, { marginTop: 10 }]}
              onPress={logout}
            >
              <Text style={styles.changePassword}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <ImageOption
          visible={modalVisible}
          closeModal={closeModal}
          selectImageFromLibrary={getLibraryPermission}
          takePhoto={getCameraPermission}
        />
      </SafeAreaView>
    </>
  );
};

export default ProfileEditUser;

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
  image: {
    height: 120,
    width: 120,
    zIndex: 0,
    borderRadius: 60,
    overflow: "hidden",
    marginTop: 15,
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
    height: 60,
    width: "90%",
    paddingLeft: 20,
    justifyContent: "center",
    backgroundColor: "#D6EFFF",
    borderRadius: 4,
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
  label: {
    marginBottom: 5,
    marginTop: 20,
    fontWeight: "400",
    fontSize: 13,
  },
  changeButton: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  changePassword: {
    color: Colors.primaryColor,
  },
  containerEditPhoto: {
    alignItems: "center",
  },
});
