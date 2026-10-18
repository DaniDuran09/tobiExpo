import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export const useLibraryPermissions = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const requestLibraryPermissions = async () => {
    let { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      const req = await ImagePicker.requestMediaLibraryPermissionsAsync();
      status = req.status;
    }

    if (status !== 'granted') {
      return {
        success: false,
        error: 'Se requieren permisos de galería para seleccionar fotos. Habilítalos en la configuración de tu dispositivo.'
      };
    }

    return { success: true };
  };

  const selectImage = async (options?: ImagePicker.ImagePickerOptions) => {
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
        allowsEditing: false,
        quality: 1,
        ...options
      });

      if (result.canceled) {
        return {
          success: false,
          error: 'Se canceló la selección de imagen'
        };
      }

      setImageUrl(result.assets[0].uri);
      const fileName = Platform.OS == "android" ? result.assets[0].fileName : result.assets[0].uri.split("ImagePicker/")[1];
      setFileName(fileName || null);
      
      return {
        success: true,
        imageUrl: result.assets[0].uri,
        fileName: fileName,
        asset: result.assets[0]
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
