import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { NavigationContainer } from '@react-navigation/native';
import RootStackScreen from './navigation/RootStackScreen';
import Toast from 'react-native-toast-message';
import { toastConfig } from './utils/toastConfig';

export default function App(): React.JSX.Element {
  
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStackScreen />
        <Toast position="top" config={toastConfig} visibilityTime={4000} />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
