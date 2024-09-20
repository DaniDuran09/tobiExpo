import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Colors } from "../../styles/Colors";
import AppStorage from "../../modules/AppStorage";
import { createCard } from "../../services";
import { useNavigation } from "@react-navigation/native";

const AddNewCard = ({route}) => {

  const {executeFunction} = route.params;

  const [formData, setFormData] = useState({
    name: "",
    card_number: "",
    month: 0,
    year: 0,
    cvv: "",
    brand: "",
  });
  const [validForm, setValidForm] = useState(false);

  const appStorage = new AppStorage();
  const navigation = useNavigation();

  const determineCardBrand = (cardNumber) => {
  const firstDigit = cardNumber.charAt(0);
  
  if (firstDigit === "4") {
    return "visa";
  } else if (firstDigit === "5") {
    return "master-card";
  } else {
    return;
  }
};

  const saveCard = async () => {
    // if (validForm) {
    //   try {
    //     formData.brand = determineCardBrand(formData.card_number)
    //     formData.month= parseInt(formData.month)
    //     formData.year= parseInt(formData.year)
    //     const token = await appStorage.getAppToken();
    //     console.log("Token: ", token)
    //     console.log("data: ", formData)

    //     const response = await createCard(token, formData);
    //     console.log("La respuesta: ", response);
    //   } catch (error) {
    //     console.log("Error: ", error);
    //     Alert.alert("Ha ocurrido un error", "Vuleve a intentarlo más tarde");
    //     navigation.goBack();
    //   }
    // } else {
    //   Alert.alert(
    //     "Completa los campos",
    //     "Rellenar correctamente todos los campos"
    //   );
    // }
    if(executeFunction) executeFunction()
  };

  useEffect(() => {
    const isCardNumberValid =
      formData.card_number.length >= 16;
    const isCVVValid = formData.cvv.length === 3;
    const isExpirationDateValid =
      formData.month >= 1 &&
      formData.month <= 12 &&
      formData.year >= 0 &&
      formData.year <= 99 &&
      formData.year >= new Date().getFullYear() % 100;
    const isNameValid = formData.name.trim() !== "";

    setValidForm(
      isCardNumberValid && isCVVValid && isExpirationDateValid && isNameValid
    );
  }, [formData]);

  const monthInputRef = useRef(null);
  const yearInputRef = useRef(null);

  const handleChangeMonth = (text) => {
    if (text.length === 2) {
      yearInputRef.current.focus();
    }
    setFormData({ ...formData, month: text });
  };

  const handleChangeYear = (text) => {
    if (formData.year && !text) {
      monthInputRef.current.focus();
    }
    setFormData({ ...formData, year: text });
  };

  const handleChangeCVV = (text) => {
    setFormData({ ...formData, cvv: text });
  };

  const handleChangeName = (text) => {
    setFormData({ ...formData, name: text });
  };

  const handleChangeCardNumber = (text) => {
    setFormData({ ...formData, card_number: text });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.newMethodText}>Agregar método de pago</Text>
        <Image
          source={require("../../assets/edit-card-icon.png")}
          style={{ width: 20, height: 20 }}
        />
      </View>
      <View style={styles.form}>
        <TextInput
          placeholder="Número de tarjeta"
          keyboardType="numeric"
          elevation={5}
          placeholderTextColor={Colors.gray}
          style={styles.textInput}
          autoCapitalize="none"
          onChangeText={(e) => handleChangeCardNumber(e)}
        />
        <TextInput
          placeholder="Nombre del titular"
          elevation={5}
          placeholderTextColor={Colors.gray}
          style={styles.textInput}
          autoCapitalize="none"
          onChangeText={(e) => handleChangeName(e)}
        />
        <View style={styles.moreInfoContainer}>
          <View style={styles.date}>
            <TextInput
              placeholder="MM"
              ref={monthInputRef}
              keyboardType="numeric"
              maxLength={2}
              placeholderTextColor={Colors.gray}
              style={[styles.textInput, { width: "50%", marginLeft: 5 }]}
              autoCapitalize="none"
              value={formData.month}
              onChangeText={(e) => handleChangeMonth(e)}
            />
            <TextInput
              placeholder="AA"
              ref={yearInputRef}
              keyboardType="numeric"
              maxLength={2}
              placeholderTextColor={Colors.gray}
              style={[styles.textInput, { width: "50%", marginLeft: 5 }]}
              autoCapitalize="none"
              value={formData.year}
              onChangeText={(e) => handleChangeYear(e)}
            />
          </View>
          <TextInput
            placeholder="CVV"
            keyboardType="numeric"
            maxLength={3}
            elevation={5}
            placeholderTextColor={Colors.gray}
            style={[styles.textInput, { width: "40%" }]}
            autoCapitalize="none"
            onChangeText={(e) => handleChangeCVV(e)}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveCard}>
          <Text style={styles.textButton}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddNewCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    flexDirection: "row",
    gap: 5,
    padding: 30,
  },
  newMethodText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  form: {
    alignItems: "center",
  },
  textInput: {
    width: "90%",
    height: 60,
    borderRadius: 4,
    paddingLeft: 20,
    backgroundColor: Colors.lightBlue,
    marginTop: "8%",
    justifyContent: "center",
  },
  moreInfoContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  saveButton: {
    marginTop: 50,
    width: "90%",
    height: 60,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    fontSize: 18,
    color: Colors.gray,
    fontWeight: "600",
  },
  date: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    width: "40%",
    justifyContent: "center",
  },
});
