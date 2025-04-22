import React, { useState, useEffect } from "react";
import { ScrollView, TextInput, TouchableOpacity } from "react-native";
import { View, Text, Button } from "react-native-ui-lib";
import { Avatar, RadioButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../../styles/Colors";
import Loading from "../../../components/Loading";
import Toast from "react-native-toast-message";
import ApiFetcher from "../../../modules/ApiFetcher";

const PetProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params as { item: Pet };

  const [selectedPet, setSelectedPet] = useState<Pet>(item);
  const [petInfo, setPetInfo] = useState({
    name: item?.name || "",
    weight: item?.weight || 0,
    sterilized: item?.sterilized ?? false,
  });
  const [loadData, setLoadData] = useState(false);
  const apiFetcher = new ApiFetcher();

  const getPetInfo = async () => {
    setLoadData(true);
    try {
      const response = await apiFetcher.getPetById(selectedPet.id);
      if (response.code == 200) {
        setPetInfo(response.data);
      } else {
        console.log("Algo salió mal");
      }
    } catch (error) {
      console.log("Error: ", error);
      Toast.show({
        type: "error",
        text1: "No se pudo cargar la información",
        text2: `Inténtalo de nuevo más tarde`,
      });
      navigation.goBack();
    } finally {
      setLoadData(false);
    }
  };

  useEffect(() => {
    getPetInfo();
  }, []);
  const rawGender = selectedPet?.pet_breed?.life_stages?.[0]?.gender;
  const petGender =
    rawGender === "male"
      ? "Macho"
      : rawGender === "female"
      ? "Hembra"
      : "Sin especificar";
  const updatePet = async () => {
    setLoadData(true);
    try {
      const response = await apiFetcher.updatePet(selectedPet.id, petInfo);

      if (response.code === 200) {
        Toast.show({
          type: "success",
          text1: "Guardado",
          text2: `Se actualizó la información de ${response.data.name}`,
        });
        getPetInfo();
        navigation.goBack();
      }
    } catch (error) {
      console.log("Error al actualizar mascota:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Mascota no actualizada",
      });
    } finally {
      setLoadData(false);
    }
  };

  if (loadData) {
    return (
      <Loading backgroundColor={Colors.white} textColor={Colors.primaryColor} />
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        row
        padding-20
        style={{ borderBottomWidth: 1, borderBottomColor: Colors.secondGray }}
      >
        <View center>
          <Avatar.Image source={{ uri: selectedPet?.picture }} size={100} />
          <Text text80 color={Colors.gray} marginT-10>
            Editar foto
          </Text>
        </View>

        <View marginL-10 centerV>
          <Text text40BL>{petInfo.name}</Text>
          <Text text80L color={Colors.gray} marginT-5>
            {`${selectedPet?.age} años | ${petGender} | ${selectedPet.pet_breed.description}`}
          </Text>
        </View>
      </View>

      <View width={"100%"} marginL-20>
        <Text marginB-5 marginT-10 text80>
          Nombre
        </Text>
        <TextInput
          placeholder="Nombre"
          placeholderTextColor="#000"
          elevation={5}
          value={petInfo.name}
          onChangeText={(text) => setPetInfo({ ...petInfo, name: text })}
          style={{
            color: "#000",
            height: 60,
            width: "90%",
            paddingLeft: 20,
            justifyContent: "center",
            backgroundColor: "#D6EFFF",
            borderRadius: 4,
          }}
          autoCapitalize="none"
        />

        <Text marginB-5 marginT-20 text80>
          Peso de tu mascota
        </Text>
        <TextInput
          placeholder="Peso"
          placeholderTextColor="#000"
          elevation={5}
          value={petInfo.weight}
          onChangeText={(text) => setPetInfo({ ...petInfo, weight: text })}
          style={{
            color: "#000",
            height: 60,
            width: "90%",
            paddingLeft: 20,
            justifyContent: "center",
            backgroundColor: "#D6EFFF",
            borderRadius: 4,
          }}
          autoCapitalize="none"
        />
        <View
          marginT-20
          height={60}
          width={'90%'}
          paddingL-20
          backgroundColor="#D6EFFF"
          style={{
            justifyContent: "center",
            borderRadius: 4,
          }}
        >
          <View row centerV>
            <RadioButton.Android
              value="yes"
              status={petInfo.sterilized ? "checked" : "unchecked"}
              color={Colors.primaryColor}
              onPress={() =>
                setPetInfo({ ...petInfo, sterilized: !petInfo.sterilized })
              }
            />
            <Text marginL-10>¿Tu mascota está esterilizada?</Text>
          </View>
        </View>

        <View
          row
          marginT-20
          width={"90%"}
          style={{ justifyContent: "space-between"}}
        >
          <View row center>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={24}
              color={Colors.gray}
            />
            <Text color={Colors.gray} marginL-5>
              Eliminar mascota
            </Text>
          </View>

          <Button
            backgroundColor={Colors.primaryColor}
            label="Actualizar"
            style={{ borderRadius: 10, padding: 15 }}
            onPress={updatePet}
          />
        </View>
      </View>

      <View paddingH-10>
        <View marginB-10>
          <Text text70BO marginT-5>
            MIS DOCUMENTOS
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("IdInfoPet", { pet: selectedPet })
          }
        >
          <View
            row
            spread
            centerV
            paddingV-15
            width={"100%"}
            style={{ borderBottomWidth: 0.2 }}
          >
            <View row gap-10 centerV marginL-10>
              <Icon name="qrcode" size={25} color={Colors.black} />
              <Text text70>ID digital de mi mascota</Text>
            </View>
            <View row gap-10 centerV>
              <Icon name="chevron-right" size={25} color={Colors.black} />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProfileEditUser")}
        >
          <View
            row
            spread
            centerV
            paddingV-15
            width={"100%"}
            style={{ borderBottomWidth: 0.2 }}
          >
            <View row gap-10 centerV marginL-10>
              <Icon
                name="cards-playing-heart-outline"
                size={25}
                color={Colors.black}
              />
              <Text text70>Cartilla de vacunación</Text>
            </View>
            <View row gap-10 centerV>
              <Icon name="chevron-right" size={25} color={Colors.black} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PetProfile;
