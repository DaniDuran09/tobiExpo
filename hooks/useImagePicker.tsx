import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

export default function useImagePicker() {
    const [cameraPermissionsStatus, requestCameraPermission] = ImagePicker.useCameraPermissions();
    const [mediaLibraryPermissionsStatus, requestMediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
    const [imageAssets, setImageAssets] = useState<ImagePicker.ImagePickerAsset[]>([])

    console.log(cameraPermissionsStatus)
    const pickImage = async (options?: ImagePicker.ImagePickerOptions) => {
        setImageAssets([])

        if (!mediaLibraryPermissionsStatus?.granted) {
            const response = await requestMediaLibraryPermission()
            if (!response.granted) {
                const error = new Error("Image library permissions are required")
                error.name = "ImageLibraryPermissionsError"
                throw error
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync(options)
        if (!result.canceled) {
            setImageAssets(result.assets)
        }
        return result
    }

    const takePhoto = async (options?: ImagePicker.ImagePickerOptions) => {
        setImageAssets([])

        if (!cameraPermissionsStatus?.granted) {
            const response = await requestCameraPermission()
            if (!response.granted) {
                const error = new Error("Camera permissions are required")
                error.name = "CameraPermissionsError"
                throw error
            }
        }

        const result = await ImagePicker.launchCameraAsync(options)
        if (!result.canceled) {
            setImageAssets(result.assets)
        }
        return result
    }

    return { imageAssets, pickImage, takePhoto }
}