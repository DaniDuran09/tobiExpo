import axios from "axios";

export const fetchPaymentIntent = async (amount) => {
  const url = "https://api.stripe.com/v1/payment_intents";

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Bearer sk_test_51PB4Gl085HALpYaPGQIZ7LIL0ZmQWg2gCdk3sOXSyRP76wdIWZnmZRcIDGmh0KZIZJe5lkOXP00cxCC1CVMgWwSn00IoZ2VULe",
  };

  const params = `amount=${amount}&currency=mxn`;

  try {
    const response = await axios.post(url, params, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
