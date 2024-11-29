import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Camera from "expo-camera";
import { useDispatch } from "react-redux";
import { setPicturePet } from "../../../redux/slice/petSlice";
import ImageOption from "../../../components/ImageOption";

const FinalScreenRegisterPet = (props) => {
  const { backgroundColor, imageSource, setImageSource } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos insuficientes",
          "Se necesitan permisos para acceder a la biblioteca de imágenes."
        );
      }
    })();
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };

  const selectImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log("result: ", result);
      if (!result.canceled) {
        closeModal();
        setImageSource({ uri: result.assets[0] });
        dispatch(setPicturePet(result.assets[0]));
      }
    } catch (error) {
      Alert.alert(
        "Ha ocurrido un error al cargar la foto",
        "Puedes continuar y después agregar una foto."
      );
      console.log("Error: ", error);
    }
  };

  const takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permisos insuficientes",
        "Se necesitan permisos para acceder a la cámara."
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImageSource({ uri: result.uri });
        closeModal();
      }
    } catch (error) {
      Alert.alert(
        "Ha ocurrido un error al tomar la foto",
        "Puedes continuar y después agregar una foto."
      );
      console.log("Error: ", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Agregar foto de perfil</Text>
      </View>
      <View style={styles.secondContainer}>
        {imageSource ? (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.imageContainer}>
              <Image
                source={imageSource.uri}
                style={styles.imageSelected}
                resizeMode={"cover"}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../../../assets/camera-icon.png")}
                style={styles.image}
                resizeMode={"contain"}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
      <ImageOption
        visible={modalVisible}
        closeModal={closeModal}
        selectImageFromLibrary={selectImageFromLibrary}
        takePhoto={takePhoto}
      />
    </View>
  );
};

export default FinalScreenRegisterPet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  titleContainer: {
    marginTop: "5%",
    alignItems: "center",
  },
  titleText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#EF4136",
  },
  imageContainer: {
    marginTop: 15,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  image: {
    height: 30,
    width: 30,
  },
  imageSelected: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  secondContainer: {
    marginTop: "8%",
    alignItems: "center",
  },
  stepContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "65%",
  },
  buttonNext: {
    marginTop: 30,
    height: 60,
    width: "100%",
    minWidth: 400,
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
