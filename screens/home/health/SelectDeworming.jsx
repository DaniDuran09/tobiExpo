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
import { formatDateToDDMMYYYY } from "../../../utils/scripts";
import momentTZ from "../../../utils/moment";

const SelectDeworming = ({ petId, action }) => {
  const navigation = useNavigation();
  const apiFetcher = new ApiFetcher();

  const [date, setDate] = useState(null);
  const [partner, setPartner] = useState("");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState();
  const [frecuencyValue, setFrecuencyValue] = useState("");
  const [derwomerId, setDerwomerId] = useState("");
  const [dewormingTypeValue, setDewormingTypeValue] = useState([]);

  const [frequencies, setFrequencies] = useState([
    { id: 1, value: "Anual", isChecked: false },
    { id: 2, value: "Semestral", isChecked: false },
    { id: 3, value: "Trimestral", isChecked: false },
    { id: 4, value: "Mensual", isChecked: false },
    {
      id: 5,
      value: "No lo he desparacitado",
      isChecked: false,
    },
  ]);

  const [dewormingType, setDewormingType] = useState([
    { id: 1, value: "Interna", brand: "", isChecked: false, enabled: true },
    { id: 2, value: "Externa", brand: "", isChecked: false, enabled: true },
    {
      id: 3,
      value: "Ambas en una aplicación",
      brand: "",
      isChecked: false,
      enabled: true,
    },
    // {
    //   id: 4,
    //   value: "Ninguna",
    //   brand: "",
    //   isChecked: false,
    //   showOptions: false,
    // },
  ]);

  useEffect(() => {
    getDerwomings();
  }, []);

  const getDerwomings = async () => {
    try {
      console.log("petid: ", petId)
      const response = await apiFetcher.getVaccines(petId);
      setDerwomerId(response.data.dewormers[0].id);
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
    setPartner(name);
    navigation.goBack();
  };

  const save = async () => {
    if (frecuencyValue == "No lo he desparacitado" || frecuencyValue == "") {
      action();
      Toast.show({
        type: "success",
        text1: "Información guardada",
        text2: `Se guardó la desparasitación con éxito`,
      });
      return;
    } else if (!date || !frecuencyValue || !dewormingTypeValue) {
      return Toast.show({
        type: "error",
        text1: "Completa todos los cammpos",
        text2: `Datos incompletos`,
      });
    }
    try {
      dewormingType.map(async (derwomer) => {
        if (derwomer.isChecked) {
          const payload = {
            pet_id: petId,
            vaccine_id: derwomerId,
            application_day: date,
            dose: 0,
            brand: derwomer.brand || "",
            applied_by: partner || "",
            applied: true,
            deworming_type: derwomer.value,
            deworming_frequency: frecuencyValue,
            last_deworming: date,
          };
          await apiFetcher.saveDewormer(payload);
        }
      });

      action();
      Toast.show({
        type: "success",
        text1: "Desparasitación guardada",
        text2: `Se guardó la desparasitación con éxito`,
      });
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
    setSelectedBrand(value);
    setDewormingTypeValue(type);
    setDewormingType((prevDewormingType) =>
      prevDewormingType.map((item) =>
        item.id === id ? { ...item, brand: value } : item
      )
    );
  };

  // useEffect(() => {
  //   if (frecuencyValue === "No lo he desparacitado") {
  //     setDewormingTypeValue("Ninguna");
  //     setDewormingType((prevDewormingType) =>
  //       prevDewormingType.map((d) =>
  //         d.id === 4 ? { ...d, isChecked: true } : { ...d, isChecked: false }
  //       )
  //     );
  //   }
  // }, [frecuencyValue]);

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

  const renderDewormingType = ({ item }) => {
    const isFrequencyDisabled = frecuencyValue === "No lo he desparacitado";

    const handleDewormingSelection = (selectedItem, checked, id) => {
      if (selectedItem.id == 3) {
        setDewormingType((prevDewormingType) =>
          prevDewormingType.map((d) =>
            d.id != selectedItem.id
              ? { ...d, isChecked: false }
              : { ...d, isChecked: checked }
          )
        );
      } else {
        setDewormingType((prevDewormingType) =>
          prevDewormingType.map((d) =>
            d.id === selectedItem.id ? { ...d, isChecked: checked } : d
          )
        );
        if (dewormingType[2]?.isChecked) {
          setDewormingType((prevDewormingType) =>
            prevDewormingType.map((d, index) =>
              index === 2 ? { ...d, isChecked: false } : d
            )
          );
        }
      }
    };

    return (
      <View row gap-10 marginB-10>
        <View>
          <RadioButton
            label={""}
            color={Colors.primaryColor}
            selected={item.isChecked}
            onPress={() => {
              handleDewormingSelection(item, !item.isChecked, item.id);
            }}
          />
        </View>
        <View>
          <Text text70M style={isFrequencyDisabled && { opacity: 0.5 }}>
            {item.value}
          </Text>

          <>
            <Picker
              editable={!isFrequencyDisabled && item.isChecked}
              style={[
                styles.dateButton,
                (!item.isChecked || isFrequencyDisabled) && { opacity: 0.5 },
              ]}
              placeholder={"Marca"}
              onChange={(value) =>
                handleSelectDewormingBrand(item.value, value, item.id)
              }
              value={item.brand}
              items={brands}
            />
            <TouchableOpacity
              style={[
                styles.dateButton,
                (!item.isChecked || isFrequencyDisabled) && { opacity: 0.5 },
              ]}
              disabled={!item.isChecked || isFrequencyDisabled}
              onPress={() =>
                navigation.navigate("SelectPartner", {
                  action: handleSelectPartner,
                  vaccine: "Despa",
                })
              }
            >
              <Text>{partner ? partner : "Aplicado por"}</Text>
            </TouchableOpacity>
          </>
        </View>
      </View>
    );
  };

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
      <Text
        text70M
        marginT-10
        style={frecuencyValue == "No lo he desparacitado" && { opacity: 0.5 }}
      >
        2. ¿Cuándo fue la última desparasitación de tu mascota?
      </Text>
      <DateTimePicker
        editable={frecuencyValue != "No lo he desparacitado"}
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
          setDate(momentTZ(date).format("DD/MM/YYYY"));
        }}
      />
      <Text
        text70M
        marginT-10
        style={frecuencyValue == "No lo he desparacitado" && { opacity: 0.5 }}
      >
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
