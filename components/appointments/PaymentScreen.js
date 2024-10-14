import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import { fetchPaymentIntent } from "../../services/stripe.api";
import Toast from "react-native-toast-message";
import { ActivityIndicator, StyleSheet } from "react-native";
import WebView from "react-native-webview";

const PaymentScreen = (props) => {
  const { amount, closeBottomSheet } = props;
  const { confirmPayment } = useConfirmPayment();
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const clientSecret = await fetchClientSecret();

      if (!cardDetails?.complete) {
        Toast.show({
          type: "error",
          text1: "Datos incompletos",
          text2: `Completa los datos`,
        });
        return;
      }
      const { error } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
        billingDetails: {},
      });

      if (error) {
        Toast.show({
          type: "error",
          text1: "Error al procesar el pago",
          text2: `Inténtalo de nuevo más tarde`,
        });
      } else {
        Toast.show({
          type: "success",
          text1: "Pago exitoso",
          text2: `Gracias por tu pago`,
        });
        setCardDetails(null);
        closeBottomSheet();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al procesar el pago",
        text2: `Inténtalo de nuevo más tarde`,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClientSecret = async () => {
    // Aquí debe haber una petición al backend para obtener el clientSecret
    try {
      const response = await fetchPaymentIntent(1000);
      return response.client_secret;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <View height={"100%"}>
      {/* <Text text60BO center marginT-20>
        Ingresa tus datos
      </Text>
      <View flex centerV>
        <View centerH>
          <CardField
            postalCodeEnabled={false}
            placeholders={{
              number: "4242 4242 4242 4242",
            }}
            cardStyle={{
              borderColor: "#000000",
              borderWidth: 1,
              borderRadius: 8,
            }}
            style={{
              width: "95%",
              height: 50,
              marginVertical: 30,
            }}
            onCardChange={(cardDetails) => {
              setCardDetails(cardDetails);
            }}
          />
        </View>
      </View>
      <View bottom paddingB-15 center>
        <Text text90R>
          Estos datos son confidenciales y no serán almacenados por Tobi
        </Text>
        <TouchableOpacity
          disabled={loading}
          style={styles.buttonStyles}
          onPress={handlePayment}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.text}>Pagar</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={closeBottomSheet}
          style={{ height: 30 }}
          center
          marginT-20
        >
          <Text text70BO>Cancelar</Text>
        </TouchableOpacity>
      </View> */}
      <WebView
        source={{ uri: "https://buy.stripe.com/test_eVa9AA51U3Yv8bm6oo" }}
        style={{ flex: 1 }}
        // onNavigationStateChange={handleNavigationStateChange}
      />
      <TouchableOpacity
        onPress={closeBottomSheet}
        style={{ height: 30 }}
        center
        marginT-20
      >
        <Text text70BO>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  buttonStyles: {
    marginTop: 30,
    height: 60,
    width: "95%",
    backgroundColor: "#EF4136",
    borderRadius: 65,
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "700",
  },
});
