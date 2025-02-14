import { ImageSourcePropType } from 'react-native';

export interface ServiceOptionProps {
  imageSource: ImageSourcePropType;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export type NavigationType = {
  navigate: (screen: string, params?: any) => void;
};
