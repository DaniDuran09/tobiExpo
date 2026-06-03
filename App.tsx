import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Linking, StyleSheet, Text, useColorScheme, View } from "react-native";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { NavigationContainer } from "@react-navigation/native";
import RootStackScreen from "./navigation/RootStackScreen";
import Toast from "react-native-toast-message";
import { toastConfig } from "./utils/toastConfig";
import { StripeProvider } from "@stripe/stripe-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationContext from "./context/NotificationContext";
import { navigate, navigationRef } from "./hooks/navigationRef";

export default function App(): React.JSX.Element {
  const [publishableKey, setPublishableKey] = useState("");
  const colorScheme = useColorScheme();

  const fetchPublishableKey = async () => {
    // const key = await fetchKey(); // fetch key from your server here
    setPublishableKey(
      "pk_test_51PB4Gl085HALpYaPdqbw0eAm5ykYrXzsBhofGkQaQ9hQtuegWsmDbkDDk6Oyb0UhI5hZi3acSGAUytrNYJtiF4aF00r0lf8pUt"
    );
  };



  useEffect(() => {
    fetchPublishableKey();
  }, []);
  const linkingConfig = {
  prefixes: ['tobi://', 'exp+tobi://'],
  config: {
    screens: {
      Home: {
        screens: {
          Explore: {
            screens: {
              SelectService: 'servicios/:serviceId/:petId',
              PaymentScreen: 'payment',
            },
          },
        },
      },
    },
  },
};



  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="com.tobi" // required for Apple Pay
    // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colorScheme === "dark" ? "#000" : "#fff"}
      />
      <Provider store={store}>
        <NavigationContainer
          linking={linkingConfig}
            ref={navigationRef}
        >
          <NotificationContext>
            <RootStackScreen />
          </NotificationContext>
          <Toast position="top" config={toastConfig} visibilityTime={4000} />
        </NavigationContainer>
      </Provider>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
