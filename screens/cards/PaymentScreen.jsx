import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState();

  const handlePayPress = async () => {
    const { paymentIntent, error } = await confirmPayment('tu_client_secret', {
      type: 'Card',
      billingDetails: {
        email: 'email@example.com',
        // Otros detalles de facturación opcionales
      },
    });

    if (error) {
      console.log(`Error de pago: ${error.message}`);
    } else if (paymentIntent) {
      console.log('Pago realizado con éxito', paymentIntent);
    }
  };
  

  return (
    <View>
      <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
        }}
      />
      <Button onPress={handlePayPress} title="Pagar" />
    </View>
  );
};

export default PaymentScreen;
