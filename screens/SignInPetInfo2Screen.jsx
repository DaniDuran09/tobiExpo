import React, { useEffect } from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { Colors } from "../styles/Colors";
import ApiFetcher from "../modules/ApiFetcher";
import ViewLoading from "../components/ViewLoading";
import AppStorage from "../modules/AppStorage";
import { setUser } from "../redux/slice/userSlice";
import { calculatePetAge, formatDateToDDMMYYYY } from "../utils/scripts";
import { useNavigation } from "@react-navigation/native";

const SignInPetInfo2Screen = (props) => {
  const [selectedLanguage, setSelectedLanguage] = React.useState("");
  const [selectedFoodBrand, setSelectedFoodBrand] = React.useState("");

  const pickerRef = React.useRef();
  const [foodsType, setFoodsType] = React.useState([]);
  const [foodsBrands, setFoodsBrands] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [typePicker, setTypePicker] = React.useState("typeFood");

  const dispatch = useDispatch();
  const apiFetcher = new ApiFetcher();
  const appStorage = new AppStorage();
  const navigation = useNavigation()

  const { info, pet, user } = props;

  useEffect(() => {
    // foodType(1);
    // foodBrandsMethod();
  }, []);

  // const foodType = (itemId) => {
  //   foodTypes(itemId)
  //     .then((response) => {
  //       setFoodsType(response.data);
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //       Alert.alert("Sucedio un error!", "El servicio no esta disponible", [
  //         { text: "OK", onPress: () => setLoading(false) },
  //       ]);
  //     });
  // };

  // const foodBrandsMethod = () => {
  //   foodBrandsService()
  //     .then((response) => {
  //       setFoodsBrands(response.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log("err", err);
  //       Alert.alert("Sucedio un error!", "El servicio no esta disponible", [
  //         { text: "OK", onPress: () => setLoading(false) },
  //       ]);
  //     });
  // };

  const goToSearchItem = async (type) => {
    navigation.navigate("SearchItem", {
      type: type,
      setValue: setValue,
    });
  };

  const setValue = (value) => {
    setSelectedLanguage(value);
    navigation.goBack();
  };

  const goToSearchBrand = async (type) => {
    navigation.navigate("SearchItem", {
      type: type,
      setValue: setValueBrand,
    });
  };

  const setValueBrand = (value) => {
    setSelectedFoodBrand(value);
    navigation.goBack();
  };

  const submitInfo = async () => {
    setLoading(true);
    if (selectedFoodBrand === "" || selectedLanguage === "")
      return Alert.alert("Tobi", "Debes llenar todos los campos");
    try {
      
      const data = {
        name: user.name,
        last_name: user.last_name,
        phone: user.phone,
        email: user.email,
        birthday: formatDateToDDMMYYYY(user.birthday),
        password: user.password,
        pet:
          {
            name: pet.name,
            last_name: "",
            // age: calculatePetAge(pet.birthday),
            birthday: formatDateToDDMMYYYY(pet.birthday),
            color: "",
            gender: pet.gender,
            weight: pet.weight,
            activity_level_id: 1,
            pet_breed_id: info.pet_breed_id,
            food_brand_id:
              Platform.OS === "ios" ? selectedFoodBrand.id : selectedFoodBrand,
            type_food_id:
              Platform.OS === "ios" ? selectedLanguage.id : selectedLanguage,
            activity_level_id: info.activity_level_id,
            sterilized: info.sterilized,
          },
      };

      console.log("ASI SE VE LO VOY A MANDAR: ", data);

      const response = await apiFetcher.registerUser(data);
      console.log("Esta es la respuesta: ", response);
      if (response.code == 200 || response.code == 201) {
        await appStorage.saveUser(response.data);
        dispatch(setUser(response.data));
        await appStorage.saveAppToken(response.data.token);

        navigation.replace("Home");
      } else {
        Alert.alert("Error", `${response.errors[0]}`);
      }
    } catch (error) {
      console.log("Error: ",error)
      Alert,
        alert("Ocurrió un error en el servidor", "Por favor intente más tarde");
    } finally {
      setLoading(false);
    }

    //navigation.navigate('LoginScreen')
  };


  const submitMe = (val) => {
    setShowModal(val);
  };

  const itemValue = (val, type) => {
    if (type === "typeFood") {
      setSelectedLanguage(val);
    } else {
      setSelectedFoodBrand(val);
    }
  };

  return (
    <>
      {loading ? (
        <ViewLoading
          waitString="Espere"
          backgroundColor={Colors.secondaryColor}
        />
      ) : (
        <View style={{ flex: 1, backgroundColor: Colors.secondaryColor }}>
          <KeyboardAvoidingView
            style={{ flexDirection: "column", justifyContent: "center" }}
            behavior={Platform.OS == 'ios' && "height"}
            enabled
          >
            <ScrollView>
              <View>
                <View
                  style={{
                    justifyContent: "space-around",
                    alignItems: "flex-start",
                    paddingLeft: 20,
                    marginTop: 50,
                  }}
                >
                  <Image
                    source={require("../assets/frame.png")}
                    style={{ height: 80, width: 150 }}
                    resizeMode={"contain"}
                  />
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "900",
                      textAlign: "center",
                      color: "#EF4136",
                      marginTop: 20,
                    }}
                  >
                    Registro
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontSize: 20,
                      fontWeight: "500",
                      textAlign: "center",
                      color: "#EF4136",
                      marginTop: 20,
                    }}
                  >
                    Tu mascota | Cuéntanos más
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                    marginTop: "8%",
                  }}
                >
                </View>
                <View
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginTop: "55%",
                  }}
                >
                  <Image
                    source={require("../assets/steper3.png")}
                    style={{
                      height: 60,
                      width: "90%",
                    }}
                  />
                  <View>
                    <TouchableOpacity
                      style={{
                        marginTop: 30,
                        height: 60,
                        width: "100%",
                        minWidth: 400,
                        backgroundColor: "#EF4136",
                        borderRadius: 65,
                        justifyContent: "center",
                      }}
                      onPress={submitInfo}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 16,
                          color: "white",
                          fontWeight: "700",
                        }}
                      >
                        Siguiente
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      )}
    </>
  );
};

export default SignInPetInfo2Screen;

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#009387",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    width: "90%",
    height: 60,
    borderRadius: 4,
    paddingLeft: 20,
    backgroundColor: Colors.white,
    marginTop: "8%",
    justifyContent: "center",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
