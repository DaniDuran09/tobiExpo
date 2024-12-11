import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Checkbox,
  DateTimePicker,
  Image,
  Picker,
  RadioButton,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { FlatList, StyleSheet } from "react-native";
import despa from "../../../assets/despa-black.png";
import { Colors } from "../../../styles/Colors";
import { useNavigation } from "@react-navigation/native";
import ApiFetcher from "../../../modules/ApiFetcher";
import Toast from "react-native-toast-message";

const SelectDeworming = ({ petId }) => {
  const navigation = useNavigation();
  const apiFetcher = new ApiFetcher();

  const [date, setDate] = useState(null);
  const [partner, setPartner] = useState("");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState();
  const [frecuencyValue, setFrecuencyValue] = useState("");
  const [derwomerId, setDerwomerId] = useState("");
  const [dewormingTypeValue, setDewormingTypeValue] = useState("");

  const [frequencies, setFrequencies] = useState([
    { id: 1, value: "Anual", isChecked: false },
    { id: 2, value: "Semestral", isChecked: false },
    { id: 3, value: "Trimestral", isChecked: false },
    { id: 4, value: "Mensual", isChecked: false },
    { id: 5, value: "No lo he desparacitado", isChecked: false },
  ]);

  const [dewormingType, setDewormingType] = useState([
    { id: 1, value: "Interna", brand: "", isChecked: false },
    { id: 2, value: "Externa", brand: "", isChecked: false },
  ]);

  useEffect(() => {
    getDerwomings();
  }, []);

  const getDerwomings = async () => {
    try {
      const response = await apiFetcher.getVaccines(petId);
      setDerwomerId(response.data.dewormers[0].id)
      const data = response.data.dewormer_brands.map((dewormer) => ({
        label: dewormer,
        value: dewormer,
      }));
      setBrands(data);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `No hemos podido obtener la información`,
      });
    }
  };

  const handleSelectPartner = (name, deworming) => {
    setPartner(name)
    navigation.goBack();
  };

  const save = async () => {
    try {
      const payload = {
        pet_id: petId,
        vaccine_id: derwomerId,
        application_day: date,
        dose: 0,
        brand: selectedBrand,
        applied_by: partner,
        applied: true,
        deworming_type: dewormingTypeValue,
        deworming_frequency: frecuencyValue,
        last_deworming: date,
      };
      const response = await apiFetcher.saveDewormer(payload)
      console.log("response: ", response)
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `No hemos podido obtener la información`,
      });
    }
  };

  const handleSelect = (selected) => {
    setFrecuencyValue(selected.value);
    setFrequencies((prevFrequencies) =>
      prevFrequencies.map((item) => ({
        ...item,
        isChecked: item.id === selected.id,
      }))
    );
  };

  const handleSelectDewormingBrand = (type, value, id) => {
    setSelectedBrand(value)
    setDewormingTypeValue(type)
    setDewormingType((prevDewormingType) =>
      prevDewormingType.map((item) =>
        item.id === id ? { ...item, brand: value } : item
      )
    );
  };

  const renderFrequency = ({ item }) => (
    <View row centerV gap-5 marginB-5>
      <RadioButton
        label={""}
        color={Colors.primaryColor}
        selected={item.isChecked}
        onPress={() => handleSelect(item)}
      />
      <Text text70M>{item.value}</Text>
    </View>
  );

  const renderDewormingType = ({ item }) => (
    <View row gap-10>
      <View>
        <RadioButton
          label={""}
          color={Colors.primaryColor}
          onPress={() => {
            setDewormingType((prevDewormingType) =>
              prevDewormingType.map((d) =>
                d.id === item.id
                  ? { ...d, isChecked: true }
                  : { ...d, isChecked: false }
              )
            );
          }}
          selected={item.isChecked}
        />
      </View>
      <View>
        <Text text70M>{item.value}</Text>
        <Picker
          editable={item.isChecked}
          style={[
            styles.dateButton,
            !item.isChecked && { opacity: 0.5 },
          ]}
          placeholder={"Marca"}
          onChange={(value) => handleSelectDewormingBrand(item.value, value, item.id)}
          value={item.brand}
          items={brands}
        />
        <TouchableOpacity
          style={[
            styles.dateButton,
            !item.isChecked && { opacity: 0.5 },
          ]}
          disabled={!item.isChecked}
          onPress={() =>
            navigation.navigate("SelectPartner", {
              action: handleSelectPartner,
              vaccine: "Despa",
            })
          }
        >
          <Text>{partner ? partner : "Aplicado por"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View padding-10>
      <Text text70M>1. ¿Con qué frecuencia desparasitas a tu mascota?</Text>
      <View backgroundColor={Colors.mediumWhite} padding-15 row gap-15>
        <Image source={despa} width={20} height={20} resizeMode="contain" />
        <View>
          <FlatList
            data={frequencies}
            renderItem={renderFrequency}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
      <Text text70M marginT-10>
        2. ¿Cuándo fue la última desparasitación de tu mascota?
      </Text>
      <DateTimePicker
        display="spinner"
        style={[
          {
            backgroundColor: Colors.mediumWhite,

            padding: 10,
            marginTop: "4%",
            height: 50,
          },
        ]}
        placeholder={"Fecha de aplicación"}
        mode={"date"}
        onChange={(date) => {
          setDate(date.toLocaleDateString("es-us"));
        }}
      />
      <Text text70M marginT-10>
        3. ¿Qué tipo?
      </Text>
      <View
        backgroundColor={Colors.mediumWhite}
        padding-15
        row
        gap-15
        marginT-15
      >
        <View>
          <FlatList
            data={dewormingType}
            renderItem={renderDewormingType}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={save}>
          <Text style={styles.textButton}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectDeworming;

const styles = StyleSheet.create({
  dateButton: {
    backgroundColor: Colors.white,
    width: 150,
    padding: 8,
    marginTop: "4%",
    height: 40,
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
