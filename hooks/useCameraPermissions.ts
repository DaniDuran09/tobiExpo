import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export const useCameraPermissions = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      return {
        success: false,
        error: 'Se requieren permisos de cámara para tomar fotos'
      };
    }

    return {
      success: true
    };
  };

  const takePicture = async () => {
    try {
      const permissionResult = await requestCameraPermissions();

      if (!permissionResult.success) {
        return {
          success: false,
          error: permissionResult.error
        };
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1
      });

      if (result.canceled) {
        return {
          success: false,
          error: 'Se canceló la captura de imagen'
        };
      }

      setImageUrl(result.assets[0].uri);
      const fileName = Platform.OS == "android" ? result.assets[0].fileName : result.assets[0].uri.split("ImagePicker/")[1];
      setFileName(fileName || null);

      return {
        success: true,
        imageUrl: result.assets[0].uri,
        fileName: fileName
      };

    } catch (error) {
      return {
        success: false,
        error: 'Error al tomar la foto'
      };
    }
  };

  return {
    setImageUrl,
    imageUrl,
    fileName,
    takePicture,
    requestCameraPermissions
  };
};
