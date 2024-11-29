import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import HeaderTitle from "../../../components/HeaderTitle";
import { Colors } from "../../../styles/Colors";
import { useNavigation } from "@react-navigation/native";
import ApiFetcher from "../../../modules/ApiFetcher";
import { formatDateToDDMMYYYY } from "../../../utils/scripts";

const ThirdScreenRegisterPet = (props) => {
  const { petInfo } = props;

  const [brand, setBrand] = useState({
    id: 0,
    label: "",
  });
  const [foodType, setFoodType] = useState({
    id: 0,
    label: "",
  });

  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation();

  const goToSearchItem = async (type) => {
    navigation.navigate("SearchItem", {
      type: type,
      setValue: setSearchBrand,
    });
  };

  const goToSearchItemType = async (type) => {
    navigation.navigate("SearchItem", {
      type: type,
      setValue: setSearchFoodType,
    });
  };

  const setSearchBrand = (value) => {
    setBrand(value);
    petInfo.food_brand_id = value.id;
    navigation.goBack();
  };

  const setSearchFoodType = (value) => {
    setFoodType(value);
    petInfo.type_food_id = value.id;
    navigation.goBack();
  };

  const goToNextStep = async () => {
    // navigation.navigate("FinalScreenRegisterPet");
    try {
      petInfo.birthday = formatDateToDDMMYYYY(petInfo.birthday);
      petInfo.weight = parseInt(petInfo.weight);
      const response = await apiFetcher.registerPet(petInfo);
    } catch (error) {
      console.log("Error: ", error);
      Alert.alert(
        "Ocurrió un error",
        "No pudimos guardar la información de tu mascota. Intenta de nuevo más tarde"
      );
    }
  };

  return (
    <View style={styles.container}>
      <HeaderTitle title={"Tu mascota | Su alimento"} />
      <View style={styles.containerForm}>
        <TouchableOpacity
          style={styles.textInput}
          onPress={() => goToSearchItem("foodBrand")}
        >
          <Text>
            {brand.label == "" ? "¿Qué marca le compras?" : brand.label}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.textInput}
          onPress={() => goToSearchItemType("foodType")}
        >
          <Text>
            {foodType.label == "" ? "Tipo de alimento" : foodType.label}
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.textInput} onPress={() => {}}>
          <Text>Elige el producto</Text>
        </TouchableOpacity> */}
        {/* <View style={styles.containerImage}>
          <Image
            source={require("../../../assets/step3.png")}
            style={{
              height: 120,
              width: "90%",
            }}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.buttonNext} onPress={goToNextStep}>
            <Text style={styles.textNext}>Siguiente</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

export default ThirdScreenRegisterPet;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: 15,
  },
  containerForm: {},
  textInput: {
    width: "100%",
    height: 60,
    borderRadius: 4,
    paddingLeft: 20,
    backgroundColor: Colors.lightBlue,
    marginTop: "8%",
    justifyContent: "center",
  },
  containerImage: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "63%",
  },
  buttonNext: {
    marginTop: 30,
    height: 60,
    width: "100%",
    minWidth: 400,
    backgroundColor: "#EF4136",
    borderRadius: 65,
    justifyContent: "center",
  },
  textNext: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "700",
  },
});
