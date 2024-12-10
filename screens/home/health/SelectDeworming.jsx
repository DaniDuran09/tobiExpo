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

const SelectDeworming = ({ info, dewormings }) => {
  const navigation = useNavigation();
  const apiFetcher = new ApiFetcher();

  // const [checkDewormingFrecuency, setCheckDewormingFrecuency] = useState(false);
  const [date, setDate] = useState(null);
  const [partner, setPartner] = useState("");
  const [brands, setBrands] = useState([]);
  const [frecuencyValue, setFrecuencyValue] = useState("");

  const [frequencies, setFrequencies] = useState([
    { id: 1, value: "Anual", isChecked: false },
    { id: 2, value: "Semestral", isChecked: false },
    { id: 3, value: "Trimestral", isChecked: false },
    { id: 4, value: "Mensual", isChecked: false },
    { id: 5, value: "No lo he desparacitado", isChecked: false },
  ]);

  useEffect(() => {
    getDerwomings();
  }, []);

  const getDerwomings = async () => {
    try {
      const response = await apiFetcher.getVaccines(629);
      const data = response.data.dewormer_brands.map((dewormer) => ({
        label: dewormer,
        value: dewormer,
      }));
      setBrands(data);
    } catch (error) {}
  };

  const handleSelectPartner = (name, deworming) => {
    navigation.goBack();
  };

  const save = async () => {
    try {
      const payload = {
        pet_id: 0,
        vaccine_id: 0,
        application_day: date,
        dose: 0,
        brand: "",
        applied_by: "",
        applied: true,
        deworming_type: "",
        deworming_frequency: frecuencyValue,
        last_deworming: "",
      };
    } catch (error) {
      console.log("Error: ", error);
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
          <View row gap-10>
            <View>
              <RadioButton
                label={""}
                color={Colors.primaryColor}
                // selected={item.isChecked}
                // onPress={() => handleSelect(item.id)}
              />
            </View>
            <View>
              <Text text70M>Interna</Text>
              <Picker
                // editable={vaccine.isChecked}
                style={[
                  styles.dateButton,
                  // !vaccine.isChecked && { opacity: 0.5 },
                ]}
                placeholder={"Marca"}
                onChange={(value) => {
                  // setVaccines(
                  //   vaccines.map((v) =>
                  //     v.id === vaccine.id ? { ...v, brand: value } : v
                  //   )
                  // );
                  // setIsFocus(false);
                }}
                // value={vaccine.brand}
                items={brands}
              />
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  // !vaccine.isChecked && { opacity: 0.5 },
                ]}
                // disabled={!vaccine.isChecked}
                onPress={() =>
                  navigation.navigate("SelectPartner", {
                    action: handleSelectPartner,
                    vaccine: "Despa",
                  })
                }
              >
                <Text>{"Aplicado por"}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View row gap-10 marginT-15 centerV>
          <View>
            <RadioButton
              label={""}
              color={Colors.primaryColor}
              // selected={item.isChecked}
              // onPress={() => handleSelect(item.id)}
            />
            </View>
            <View>
              <Text text70M>Externa</Text>
              <Picker
                // editable={vaccine.isChecked}
                style={[
                  styles.dateButton,
                  // !vaccine.isChecked && { opacity: 0.5 },
                ]}
                placeholder={"Marca"}
                onChange={(value) => {
                  // setVaccines(
                  //   vaccines.map((v) =>
                  //     v.id === vaccine.id ? { ...v, brand: value } : v
                  //   )
                  // );
                  // setIsFocus(false);
                }}
                // value={vaccine.brand}
                // items={brands}
              />
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  // !vaccine.isChecked && { opacity: 0.5 },
                ]}
                // disabled={!vaccine.isChecked}
                onPress={() =>
                  navigation.navigate("SelectPartner", {
                    action: handleSelectPartner,
                    vaccine: "Despa",
                  })
                }
              >
                <Text>{"Aplicado por"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
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
