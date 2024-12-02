import {Platform} from 'react-native';
import {Colors} from '../styles/Colors';
import {
  ErrorToast,
  InfoToast,
  SuccessToast,
} from 'react-native-toast-message';
export const toastConfig = {
  success: props => (
    <SuccessToast
      {...props}
      style={{
        borderLeftColor: Colors.green,
        minHeight: 80,
        marginTop: Platform.OS != 'android' && '5%',
      }}
      text1Style={{
        fontSize: 16,
        color: Colors.green,
      }}
      text2Style={{
        fontSize: 14,
        color: Colors.green,
      }}
      text2NumberOfLines={5}
    />
  ),
  error: props => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: Colors.red,
        minHeight: 80,
        marginTop: Platform.OS != 'android' && '5%',
      }}
      // contentContainerStyle={{ paddingVertical: 15 }}
      text1Style={{
        fontSize: 16,
        color: Colors.red,
      }}
      text2Style={{
        fontSize: 14,
        color: Colors.red,
      }}
      text2NumberOfLines={5}
    />
  ),
  info: props => (
    <InfoToast
      {...props}
      style={{
        borderLeftColor: Colors.secondaryColor,
        minHeight: 80,
        marginTop: Platform.OS != 'android' && '5%',
      }}
      text1Style={{
        fontSize: 16,
        color: Colors.secondaryColor,
      }}
      text2Style={{
        fontSize: 14,
        color: Colors.secondaryColor,
      }}
      text2NumberOfLines={5}
    />
  ),
};
