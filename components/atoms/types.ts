import type {ButtonProps as ButtonPropsType} from 'react-native-ui-lib';

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
