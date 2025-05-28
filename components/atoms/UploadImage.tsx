import {
  View,
  Text,
  TouchableOpacity,
  AnimatedImage,
  LoaderScreen,
} from "react-native-ui-lib";
import React, { useState } from "react";
import { ActivityIndicator, Dimensions, Modal } from "react-native";
import { UploadImageProps } from "./types";
import { Feather, MaterialIcons, Octicons } from "react-native-vector-icons";
import { Colors } from "../../styles/Colors";
import { useCameraPermissions } from "../../hooks/useCameraPermissions";
import { useLibraryPermissions } from "../../hooks/useLibraryPermissions";
import Button from "./Button";
import Toast from "react-native-toast-message";
import Loading from "../Loading";

const UploadImage: React.FC<UploadImageProps> = ({
  type,
  visible,
  onRequestClose,
  onUpload,
  defaultImage,
  loading,
}) => {
  const [changeImage, setChangeImage] = useState(false);
  const {
    imageUrl,
    takePicture,
    setImageUrl,
    fileName: fileNameCamera,
    requestCameraPermissions,
  } = useCameraPermissions();
  const {
    imageUrl: libraryImageUrl,
    selectImage,
    fileName: fileNameLibrary,
    setImageUrl: setLibraryImageUrl,
    requestLibraryPermissions,
  } = useLibraryPermissions();

  const resetImage = () => {
    setChangeImage(true);
    setImageUrl(null);
    setLibraryImageUrl(null);
  };

  const handlePicture = async (type: "take" | "select") => {
    try {
      const result = await (type === "take" ? takePicture() : selectImage());
      if (!result.success || result.error) {
        console.log("result: ", result);
        onRequestClose();
        Toast.show({
          type: "error",
          text1: result.error,
          text2: "Por favor, intenta nuevamente más tarde",
        });
      }
    } catch (error) {}
  };

  const handleUpload = async () => {
    try {
      if (imageUrl && fileNameCamera) {
        onUpload(imageUrl, fileNameCamera);
      } else if (libraryImageUrl && fileNameLibrary) {
        onUpload(libraryImageUrl, fileNameLibrary);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const showImageSelection = changeImage || !defaultImage;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        setChangeImage(false);
        onRequestClose();
      }}
    >
      <View flex center backgroundColor={"rgba(0, 0, 0, 0.8)"}>
        <View width={"95%"} backgroundColor={"white"} br30 padding-15>
          <View absR margin-10>
            <TouchableOpacity
              onPress={() => {
                setChangeImage(false);
                onRequestClose();
              }}
            >
              <MaterialIcons name="close" size={20} color={"black"} />
            </TouchableOpacity>
          </View>
          <View centerH marginT-15>
            <Text text60BO>Certificado de {type}</Text>
            {!showImageSelection ? (
              <Text>Este es tu certificado actual</Text>
            ) : (
              <Text marginV-10>
                {imageUrl || libraryImageUrl
                  ? "Esta imagen será tu comprobante y parte del historial de salud. Podrás actualizarla con cada nueva vacuna o desparasitación."
                  : "Sube una foto del certificado de vacunación de tu mascota."}
              </Text>
            )}
          </View>
          {!showImageSelection ? (
            <View center marginT-15>
              <AnimatedImage
                source={{ uri: defaultImage }}
                height={200}
                width={200}
                loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
                animationDuration={500}
              />
              <TouchableOpacity onPress={resetImage}>
                <Text underline marginT-15>
                  Elegir otra foto
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {imageUrl || libraryImageUrl ? (
                <View center marginT-15>
                  <AnimatedImage
                    source={{ uri: imageUrl || libraryImageUrl }}
                    height={200}
                    width={200}
                    loader={
                      <LoaderScreen color={Colors.primaryColor} size={35} />
                    }
                    animationDuration={500}
                  />
                  <TouchableOpacity onPress={resetImage}>
                    <Text underline marginT-15>
                      Elegir otra foto
                    </Text>
                  </TouchableOpacity>
                  {loading ? (
                    <View margin-10>
                    <ActivityIndicator size="small" color={Colors.primaryColor} />
                    </View>
                  ) : (
                    <TouchableOpacity
                      disabled={!(imageUrl || libraryImageUrl)}
                      style={{
                        opacity: !(imageUrl || libraryImageUrl) ? 0.5 : 1,
                      }}
                      marginT-25
                      onPress={handleUpload}
                      backgroundColor={Colors.mediumGray}
                      paddingH-20
                      paddingV-10
                      br20
                    >
                      <Text color={Colors.white}>Subir</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View marginT-15 gap-15>
                  <TouchableOpacity onPress={() => handlePicture("take")}>
                    <View row gap-10>
                      <Feather name="camera" size={20} color={Colors.gray} />
                      <Text>Tomar foto</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handlePicture("select")}>
                    <View row gap-10>
                      <Octicons name="image" size={20} color={Colors.gray} />
                      <Text>Subir desde la galería</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default UploadImage;
