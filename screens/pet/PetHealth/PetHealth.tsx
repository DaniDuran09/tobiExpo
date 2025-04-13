import React, { useEffect, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity } from "react-native";
import { View, Text, Button } from "react-native-ui-lib";
import { Avatar, RadioButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useGetPetsQuery } from "../../../services/api/pets.api";
import { Colors} from "../../../styles/Colors";
import Loading from "../../../components/Loading";

const PetProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params as { item: Pet };

  const [selectedPet, setSelectedPet] = useState<Pet>(item);
  const [isSterilized, setIsSterilized] = useState<boolean>(
    item?.sterilized ?? false
  );

  const { data: petsResponse, isLoading: isLoadingPets } = useGetPetsQuery();
  const pets = petsResponse?.data || [];
  useEffect(() => {
    if (item?.id && pets.length > 0) {
      const updatedPet = pets.find((pet: Pet) => pet.id === item.id);
      if (updatedPet) {
        setSelectedPet(updatedPet);
        setIsSterilized(updatedPet?.sterilized ?? false);
      }
    }
  }, [pets]);

  if (isLoadingPets) {
    return (
      <Loading
        backgroundColor={Colors.white}
        textColor={Colors.primaryColor}
      />
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View row padding-20>
        <View center>
          <Avatar.Image source={{ uri: selectedPet?.picture }} size={100} />
          <Text text80 color={Colors.gray} marginT-10>
            Editar foto
          </Text>
        </View>

        <View marginL-10 centerV>
          <Text text40BL>{selectedPet?.name}</Text>

          <Text text80L color={Colors.gray} marginT-5>
            {`${selectedPet?.age} años | ${selectedPet?.gender} | ${selectedPet?.pet_breed}`}
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
          value={selectedPet?.name}
          style={[
            {
              color: "#000",
              height: 60,
              width: "90%",
              paddingLeft: 20,
              justifyContent: "center",
              backgroundColor: "#D6EFFF",
              borderRadius: 4,
            },
          ]}
          autoCapitalize="none"
        />
        <Text marginB-5 marginT-20 text80>
          Peso de tu mascota
        </Text>
        <TextInput
          placeholder="Peso"
          placeholderTextColor="#000"
          elevation={5}
          value={selectedPet?.weight}
          style={[
            {
              color: "#000",
              height: 60,
              width: "90%",
              paddingLeft: 20,
              justifyContent: "center",
              backgroundColor: "#D6EFFF",
              borderRadius: 4,
            },
          ]}
          autoCapitalize="none"
        />
        <View
          marginT-20
          style={{
            height: 60,
            width: "90%",
            paddingLeft: 20,
            justifyContent: "center",
            backgroundColor: "#D6EFFF",
            borderRadius: 4,
          }}
        >
          <View row centerV>
            <RadioButton.Android
              value="yes"
              status={isSterilized ? "checked" : "unchecked"}
              color="red"
              onPress={() => setIsSterilized(!isSterilized)}
            />
            <Text marginL-10>¿Tu mascota está esterilizada?</Text>
          </View>
        </View>

        <View
          row
          marginT-20
          width={"90%"}
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <View row center>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={24}
              color="lightgray"
            />
            <Text grey40 marginL-5>
              Eliminar mascota
            </Text>
          </View>

          <Button
            backgroundColor={Colors.primaryColor}
            label="Actualizar"
            style={{ borderRadius: 10, padding: 15 }}
          />
        </View>
      </View>

      <View paddingH-10>
        <View marginB-10>
          <Text text70BO black marginT-5>
            MIS DOCUMENTOS
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("NotificationsTab")}
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
