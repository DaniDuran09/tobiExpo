import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import DatePicker from 'react-native-date-picker';
import { Colors } from "../../../styles/Colors";
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation } from "@react-navigation/native";
import ApiFetcher from "../../../modules/ApiFetcher";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Loading from "../../../components/Loading";
import { formatDateToDDMMYYYY } from "../../../utils/scripts";
import Toast from "react-native-toast-message";
import EmptyVaccines from "../../../components/vaccines/EmptyVaccines";
import {
  Checkbox,
  DateTimePicker,
  Picker,
  Text,
  View,
} from "react-native-ui-lib";
import momentTZ from "../../../utils/moment";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImageOption from "../../../components/ImageOption";
import * as ImagePicker from "expo-image-picker";

const SelectVaccines = (props) => {
  const { petId, onSaveVaccines } = props;
  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation();
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectPartner, setSelectPartner] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [vaccines, setVaccines] = useState([]);
  const [brands, setBrands] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSource, setImageSource] = useState(null);

  useEffect(() => {
    getVaccines();
  }, []);

  const closeModal = () => setModalVisible(false);

  const selectImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        console.log("result; ", result.assets[0]);
        setImageSource(result.assets[0]);
        closeModal();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "No se pudo cargar la foto",
        text2: `Inténtalo de nuevo más tarde`,
      });
      console.log("Error: ", error);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageSource(result[0].uri);
        closeModal();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "No se pudo tomar la foto",
        text2: `Inténtalo de nuevo más tarde`,
      });
      console.log("Error: ", error);
    }
  };

  const getVaccines = async () => {
    setLoading(true);
    try {
      const response = await apiFetcher.getVaccines(petId);
      if (response.code == 200) {
        const newVaccines = response.data.vaccines.map((vaccine) => ({
          ...vaccine,
          isChecked: false,
          description: vaccine.description
            ? vaccine.description.split(", ").map((desc) => desc.trim())
            : [],
        }));
        setVaccines(newVaccines);
        const data = response.data.vaccine_brands.map((vaccine) => ({
          label: vaccine,
          value: vaccine,
        }));
        setBrands(data);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const insertVaccine = async (data) => {
    const response = await apiFetcher.saveVaccine(data);
    console.log("Response: ", response);
  };

  const save = async () => {
    setSaveLoading(true);
    const checkedVaccines = vaccines.filter((vaccine) => vaccine.isChecked);

    if (checkedVaccines.length === 0) {
      if (onSaveVaccines) {
        onSaveVaccines();
      }
      return;
    }

    let allVaccinesInserted = true;

    for (const vaccine of checkedVaccines) {
      if (
        vaccine.application_day === undefined ||
        vaccine.brand === undefined
      ) {
        Toast.show({
          type: "error",
          text1: "Datos incompletos",
          text2: `Completa todos los datos de las vacunas seleccionadas`,
        });
        allVaccinesInserted = false;
        break;
      } else {
        const data = {
          pet_id: petId,
          vaccine_id: vaccine.id,
          application_day: momentTZ(vaccine.application_day.moment).format(
            "dddd D [de] MMMM, h:mm [hrs]"
          ),
          dose: vaccine.dose <= 0 ? 1 : vaccine.dose,
          brand: vaccine.brand,
        };
        try {
          console.log("La data a mandar: ", data);
          await insertVaccine(data);
          Toast.show({
            type: "success",
            text1: "Vacunas guardadas",
            text2: `Se guardaron las vacunas con éxito`,
          });
        } catch (error) {
          console.error("Error inserting vaccine: ", error);
          Toast.show({
            type: "error",
            text1: "Error al guardar las vacunas",
            text2: `Ha ocurrido un problema, inténtelo de neuvo más tarde`,
          });
          allVaccinesInserted = false;
        } finally {
          setLoading(false);
        }
      }
    }

    if (allVaccinesInserted && onSaveVaccines) {
      onSaveVaccines();
    }
  };

  const handleSelectPartner = (name, vaccine) => {
    setVaccines(prevVaccines =>
      prevVaccines.map(v => (v.id === vaccine.id ? { ...v, partner: name } : v))
    );
    navigation.goBack();
    navigation.goBack();
  };

  return (
    <>
      {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      <View style={styles.containerSelectSection}>
        {vaccines.length > 0 ? (
          <>
            <Text text70>1. Selecciona las vacunas que tiene tu mascota</Text>
            <View style={styles.containerVaccinesSections}>
              <Image
                source={require("../../../assets/vaccines.png")}
                style={styles.vaccinesImage}
              />
              <View>
                {vaccines.map((vaccine) => (
                  <View key={vaccine.id} style={styles.vaccine}>
                    <View style={{ marginTop: 5 }}>
                      <Checkbox
                        color={Colors.primaryColor}
                        value={vaccine.isChecked}
                        onValueChange={(checked) => {
                          setVaccines(
                            vaccines.map((v) =>
                              v.id === vaccine.id
                                ? { ...v, isChecked: checked }
                                : v
                            )
                          );
                        }}
                      />
                    </View>
                    <View>
                      <Text style={styles.vaccineName}>{vaccine.name}</Text>
                      {vaccine?.description?.length > 0 &&
                        vaccine?.description?.map((subVaccine, index) => (
                          <Text key={index}>· {subVaccine}</Text>
                        ))}
                      <DateTimePicker
                        style={[
                          styles.dateButton,
                          !vaccine.isChecked && { opacity: 0.5 },
                        ]}
                        editable={vaccine.isChecked}
                        placeholder={"Fecha de aplicación"}
                        mode={"date"}
                        onChange={(date) => {
                          setVaccines(
                            vaccines.map((v) =>
                              v.id === vaccine.id
                                ? {
                                    ...v,
                                    application_day:
                                      date.toLocaleDateString("es-us"),
                                  }
                                : v
                            )
                          );
                        }}
                      />
                      <Picker
                        editable={vaccine.isChecked}
                        style={[
                          styles.dateButton,
                          !vaccine.isChecked && { opacity: 0.5 },
                        ]}
                        placeholder={"Marca"}
                        onChange={(value) => {
                          setVaccines(
                            vaccines.map((v) =>
                              v.id === vaccine.id ? { ...v, brand: value } : v
                            )
                          );
                          setIsFocus(false);
                        }}
                        value={vaccine.brand}
                        items={brands}
                      />
                      <TouchableOpacity
                        style={[
                          styles.dateButton,
                          !vaccine.isChecked && { opacity: 0.5 },
                        ]}
                        disabled={!vaccine.isChecked}
                        onPress={()=> navigation.navigate('SelectPartner', {action:handleSelectPartner, vaccine: vaccine })}
                      >
                        <Text>{vaccine.partner ? vaccine.partner : "Aplicado por"}</Text>
                      </TouchableOpacity>
                      <View marginT-10>
                        <Text>Etiqueta</Text>
                        <TouchableOpacity
                          disabled={!vaccine.isChecked}
                          style={{
                            borderWidth: 0.5,
                            justifyContent: "center",
                            alignItems: "center",
                            width: 80,
                            marginTop: 5,
                            height: 50,
                          }}
                          onPress={() => setModalVisible(true)}
                        >
                          {imageSource ? (
                            <Image
                              source={
                                { uri: imageSource.uri }
                              }
                              style={{ width: 80,
                                
                                height: 50,}}
                              resizeMode={"cover"}
                            />
                          ) : (
                            <Ionicons
                              name={"camera-reverse-outline"}
                              size={25}
                              color={Colors.gray}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={save}>
                {saveLoading ? (
                  <ActivityIndicator size="large" color={Colors.primaryColor} />
                ) : (
                  <Text style={styles.textButton}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <EmptyVaccines />
        )}
        <ImageOption
          visible={modalVisible}
          closeModal={closeModal}
          selectImageFromLibrary={selectImageFromLibrary}
          takePhoto={takePhoto}
        />
      </View>
    </>
  );
};

export default SelectVaccines;

const styles = StyleSheet.create({
  containerSelectSection: {
    marginTop: "10%",
  },
  containerVaccinesSections: {
    marginTop: "5%",
    backgroundColor: Colors.lightBlue,
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  vaccinesImage: {
    height: 30,
    width: 30,
    marginTop: 10,
    marginLeft: 10,
  },
  vaccine: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
    marginLeft: 10,
  },
  vaccineName: {
    fontSize: 18,
    fontWeight: "600",
  },
  dateButton: {
    backgroundColor: Colors.white,
    width: "75%",
    padding: 8,
    marginTop: "4%",
    height: 40,
  },
  dateText: {
    color: Colors.gray,
  },
  buttonContainer: {
    marginTop: "10%",
  },
  button: {
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    borderColor: Colors.primaryColor,
  },
  textButton: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primaryColor,
  },
});
