import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { View, Text } from "react-native-ui-lib";
import { Avatar } from "react-native-paper";
import { Colors } from "../../../styles/Colors";
import Toast from "react-native-toast-message";
import ApiFetcher from "../../../modules/ApiFetcher";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PetInfo = ({ route }) => {
  const { pet } = route.params;
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const rawGender = pet?.pet_breed?.life_stages?.[0]?.gender;
  const petGender =
    rawGender === "male"
      ? "Macho"
      : rawGender === "female"
      ? "Hembra"
      : "Sin especificar";

  const apiFetcher = new ApiFetcher();
  const fetchData = async () => {
    try {
      const response = await apiFetcher.getProfile();
      if (response && response.data) {
        setUserData(response.data);
      }
    } catch (e) {
      console.log("Error: ", e);
      Toast.show({
        type: "error",
        text1: "Ha ocurrido un error",
        text2: `Inténtalo de nuevo más tarde`,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        row
        padding-20
        style={{ borderBottomWidth: 1, borderBottomColor: Colors.secondGray }}
      >
        <View center>
          <Avatar.Image source={{ uri: pet?.picture }} size={100} />
        </View>
        <View marginL-10 centerV>
          <Text text40BL>{pet.name}</Text>
          <Text text80L color={Colors.gray} marginT-5>
            {`${pet?.age} años | ${petGender} | ${pet.pet_breed.description}`}
          </Text>
        </View>
      </View>

      <View padding-15>
        <Text text70BL>PET PARENT</Text>
      </View>
      <View
        marginT-5
        style={{ borderBottomWidth: 1, borderBottomColor: Colors.secondGray }}
      />
      <View margin-10 row centerV>
        <Icon name="account" size={25} color={Colors.primaryColor} />
        <Text text70L color={Colors.gray} marginL-12>
          Nombre
        </Text>
      </View>
      <View marginH-30 width={"90%"}>
        <Text text70BL color={Colors.black}>
          {userData.name}
        </Text>
      </View>
      <View margin-10 row centerV>
        <Icon name="phone" size={25} color={Colors.primaryColor} />
        <Text text70L color={Colors.gray} marginL-12>
          Celular
        </Text>
      </View>
      <View marginH-30 width={"90%"}>
        <Text text70BL color={Colors.black}>
          {userData.phone}
        </Text>
      </View>
      <View margin-10 row centerV>
        <Icon name="email" size={25} color={Colors.primaryColor} />
        <Text text70L color={Colors.gray} marginL-12>
          E-mail
        </Text>
      </View>
      <View marginH-30 marginB-20 width={"90%"}>
        <Text text70BL color={Colors.black}>
          {userData.email}
        </Text>
      </View>
      <View marginB-5 padding-15 style={{borderTopWidth:1, borderTopColor:Colors.secondGray}}>
        <Text text70BL>MASCOTA</Text>
      </View>
      <View
        style={{ borderBottomWidth: 1, borderBottomColor: Colors.secondGray }}
      />
      <View margin-10 row centerV>
        <Icon name="dog" size={25} color={Colors.primaryColor} />
        <Text text70L color={Colors.gray} marginL-12>
          Nombre
        </Text>
      </View>
      <View marginH-30 marginB-20 width={"90%"}>
        <Text text70BL color={Colors.black}>
          {pet.name}
        </Text>
      </View>
      <View margin-10 row centerV>
        <Icon name="cake" size={25} color={Colors.primaryColor} />
        <Text text70L color={Colors.gray} marginL-12>
          Edad
        </Text>
      </View>
      <View marginH-30 marginB-20 width={"90%"}>
        <Text text70BL color={Colors.black}>
          {`${pet.age} años`}
        </Text>
      </View>
      <View margin-10 row centerV>
        <Icon name="dog-side" size={25} color={Colors.primaryColor} />
        <Text text70L color={Colors.gray} marginL-12>
          Raza
        </Text>
      </View>
      <View marginH-30 marginB-20 width={"90%"}>
        <Text text70BL color={Colors.black}>
        {pet.pet_breed.description}
        </Text>
      </View>
      <View margin-10 row centerV>
        <Icon name="gender-female" size={25} color={Colors.primaryColor} />
        <Text text70L color={Colors.gray} marginL-12>
          Sexo
        </Text>
      </View>
      <View marginH-30 marginB-20 width={"90%"}>
        <Text text70BL color={Colors.black}>
        {petGender}
        </Text>
      </View>
    </ScrollView>
  );
};

export default PetInfo;
