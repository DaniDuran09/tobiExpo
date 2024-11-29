import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Modal,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../../styles/Colors";
import { useNavigation } from "@react-navigation/native";
import HeaderTitle from "../../../components/HeaderTitle";
import { calculatePetAge, formatDateToDDMMYYYY } from "../../../utils/scripts";
import { useDispatch, useSelector } from "react-redux";
import { setPetInfo } from "../../../redux/slice/petSlice";
import TobiButton from "../../../components/TobiButton";
import { DateTimePicker } from "react-native-ui-lib";


const RegisterNewPet = (props) => {
  const { pet, setPet } = props;

  const [gender, setGender] = useState("male");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState("");
  const [newInfo, setNewInfo] = useState({});

  const petInfo = useSelector((store) => store.pet.info);

  // console.log(petInfo?.birthday);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const selectPet = (val) => {
    setPet(val);
  };

  const selectGender = (val) => {
    setGender(val);
  };

  useEffect(() => {
    const updatedInfo = {
      ...petInfo,
      name: name,
      birthday: date.toLocaleDateString("es-us"),
      gender: gender,
      age: calculatePetAge(date),
    };
    dispatch(setPetInfo(updatedInfo));
  }, [name, date, gender]);

  return (
    <View style={styles.container}>
      <HeaderTitle title={"Tu mascota | Quién es"} />
      <ScrollView>
        <TextInput
          placeholder="Nombre de la mascota"
          placeholderTextColor="#000"
          style={styles.textInput}
          autoCapitalize="none"
          onChangeText={(text) => setName(text)}
        />
        <View style={styles.selectContainer}>
          <TouchableOpacity
            style={styles.buttonOption}
            onPress={() => selectPet(1)}
          >
            <View style={styles.optionSelect}>
              <Image
                source={
                  pet === 1
                    ? require("../../../assets/selected-dog.png")
                    : require("../../../assets/gray-dog.png")
                }
                style={{ height: 30, width: 30 }}
                resizeMode={"contain"}
              />
              <Text
                style={[
                  styles.textOption,
                  { fontWeight: pet === 1 ? "700" : "500" },
                ]}
              >
                Perro
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonOption}
            onPress={() => selectPet(2)}
          >
            <View style={styles.optionSelect}>
              <Image
                source={
                  pet === 2
                    ? require("../../../assets/selected-cat.png")
                    : require("../../../assets/gray-cat.png")
                }
                style={{ height: 25, width: 25 }}
                resizeMode={"contain"}
              />
              <Text
                style={[
                  styles.textOption,
                  { fontWeight: pet === 2 ? "700" : "500" },
                ]}
              >
                Gato
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.selectContainer}>
          <TouchableOpacity
            style={styles.buttonOption}
            onPress={() => selectGender("male")}
          >
            <View style={styles.optionSelect}>
              <Image
                source={
                  gender == "male"
                    ? require("../../../assets/selected-gender-M.png")
                    : require("../../../assets/gender-M.png")
                }
                style={{ height: 30, width: 30 }}
                resizeMode={"contain"}
              />
              <Text
                style={[
                  styles.textOption,
                  { fontWeight: gender == "male" ? "700" : "500" },
                ]}
              >
                Macho
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonOption}
            onPress={() => selectGender("female")}
          >
            <View style={styles.optionSelect}>
              <Image
                source={
                  gender == "female"
                    ? require("../../../assets/selected-gender-H.png")
                    : require("../../../assets/gender-H.png")
                }
                style={{ height: 25, width: 25 }}
                resizeMode={"contain"}
              />
              <Text
                style={[
                  styles.textOption,
                  { fontWeight: gender == "female" ? "700" : "500" },
                ]}
              >
                Hembra
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.birthdayContainer}>
          <DateTimePicker
            style={[
              styles.birthdayContainer,
              { paddingHorizontal: 0, marginTop: 0, width: 300, height: 60 },
            ]}
            title={"Select date"}
            placeholder={
            ""
            }
            mode={"date"}
            onChange={(selectedDate) => {
              setDate(selectedDate);
            }}
          />

          {/*
          <DateTimePicker
          style={[
            styles.birthdayContainer,
            { paddingHorizontal: 0, marginTop: 0, width: 300, height: 60 },
          ]}
          title={"Select date"}
          placeholder={
            user?.birtday === ""
              ? "Fecha de nacimiento"
              : `${user?.birtday?.toLocaleDateString("es-us")}`
          }
          mode={"date"}
          onChange={(selectedDate) => {
            setDate(selectedDate);
            handleDateConfirm(selectedDate)
          }}
        />
          */}
          <Image
            source={require("../../../assets/pastel.png")}
            style={{ height: 30, width: 30 }}
            resizeMode={"contain"}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterNewPet;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  textInput: {
    width: "100%",
    height: 60,
    borderRadius: 4,
    paddingLeft: 20,
    backgroundColor: Colors.lightBlue,
    marginTop: "8%",
    justifyContent: "center",
  },
  optionSelect: {
    flexDirection: "row",
    width: "48%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "102%",
    marginTop: "5%",
  },
  dateSelectText: {
    alignSelf: "center",
  },
  buttonOption: {
    backgroundColor: Colors.lightBlue,
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
  },
  containerImage: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "25%",
  },
  nextButtom: {
    marginTop: 30,
    height: 60,
    width: "100%",
    minWidth: 400,
    backgroundColor: "#EF4136",
    borderRadius: 65,
    justifyContent: "center",
  },
  textOption: {
    textAlign: "center",
    fontSize: 15,
    color: "black",
    marginLeft: 5,
  },
  modalContent: {
    position: "absolute",
    backgroundColor: Colors.white,
    width: "100%",
    height: "100%",
    padding: 20,
    borderRadius: 12,
    justifyContent: "center",
    zIndex: 10,
  },
  birthdayContainer: {
    backgroundColor: Colors.lightBlue,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "5%",
    borderRadius: 4,
    height: 60,
    marginTop: "5%",
  },
});
