import type { ButtonProps as ButtonPropsType } from 'react-native-ui-lib';

export type ButtonProps = ButtonPropsType & {
  size?: 'small' | 'medium' | 'large' | 'xSmall';
  variant?:
  | 'default'
  | 'primary'
  | 'disabled'
  | 'filter'
  | 'outline'
  | 'primaryContrast';
  inverted?: boolean;
  disabled?: boolean;
  width?: string | number;
  link?: boolean;
  icon?: React.ReactNode;
  iconOnRight?: boolean;
  active?: boolean;
  [key: string]: any;
  loading?: boolean;
};
export interface UploadImageProps {
  type: "vacunación" | "desparasitación";
  visible: boolean;
  onRequestClose: () => void;
  onUpload: (uri: any, filename: any) => void;
  defaultImage: string;
  loading?: boolean;
}

export interface NoHealthRecordProps {
  title: string;
  description: string;
  buttonText: string;
}

export interface ModalWeightInfoProps {
  visible: boolean;
  onRequestClose: () => void;
  idealWeight: boolean;
}

export interface ModalNoPictureProps{
  visible:boolean;
  onRequestClose:() => void;
  picture:string;
}
