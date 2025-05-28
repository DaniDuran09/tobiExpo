import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export const useLibraryPermissions = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const requestLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      return {
        success: false,
        error: 'Se requieren permisos de galería para seleccionar fotos'
      };
    }

    return {
      success: true
    };
  };

  const selectImage = async () => {
    try {
      const permissionResult = await requestLibraryPermissions();

      if (!permissionResult.success) {
        return {
          success: false,
          error: permissionResult.error
        };
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1
      });

      if (result.canceled) {
        return {
          success: false,
          error: 'Se canceló la selección de imagen'
        };
      }

      setImageUrl(result.assets[0].uri);
      const fileName = Platform.OS == "android" ? result.assets[0].fileName : result.assets[0].uri.split("ImagePicker/")[1];
      console.log("fileName: ", fileName);
      setFileName(fileName || null);
      return {
        success: true,
        imageUrl: result.assets[0].uri,
        fileName: fileName
      };

    } catch (error) {
      return {
        success: false,
        error: 'Error al seleccionar la foto'
      };
    }
  };

  return {
    imageUrl,
    fileName,
    setImageUrl,
    selectImage,
    requestLibraryPermissions
  };
};
