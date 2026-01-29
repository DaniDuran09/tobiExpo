import { useEffect, useState } from 'react';
import { View, Linking } from 'react-native';
import { Text } from 'react-native-ui-lib';

const PaymentScreen = ({ route, navigation }) => {
  const { url, cartId } = route.params || {};
  const [response,setResponse] = useState();

  useEffect(() => {
    if (!url) {
      navigation.goBack();
      return;
    }

    Linking.openURL(url);

    const sub = Linking.addEventListener('url', ({ url }) => {
      if (url.includes('payment-success')) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'ResumeByPet',
              params: { cart: cartId },
            },
          ],
        });
        //console.log(object)
      }
      console.log(url)

      if (url.includes('payment-cancel')) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'ResumeByPet',
              params: { cart: cartId },
            },
          ],
        });
      }
    });

    return () => sub.remove();
  }, []);

  return <View style={{ flex: 1 }}>
    <Text>
regresando desde stripe
    </Text>
  </View>;
};

export default PaymentScreen;
