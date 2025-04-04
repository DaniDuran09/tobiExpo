import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TabController,
  AnimatedImage,
  LoaderScreen,
} from "react-native-ui-lib";
import { Avatar } from "react-native-paper";
import { Colors } from "../../../styles/Colors";
import ApiFetcher from "../../../modules/ApiFetcher";
import HealthTabController from "../../../components/pet/Health/HealthTabController/HealthTabController";
import { FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import ListSelectPet from "../../../components/pet/Health/ListSelectPet/ListSelectPet";

const PetHealth = () => {
  const route = useRoute();
  const { idSelectedPet } = route.params as { idSelectedPet: number };
  const apiFetcher = new ApiFetcher();

  const [user, setUser] = useState<User>();
  const [pets, setPets] = useState<Array<Pet>>([]);
  const [selectedPet, setSelectedPet] = useState<Pet>({} as Pet);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await apiFetcher.getProfile();
      setUser(data);
      const { data: pets } = await apiFetcher.getPets();
      setPets(pets);
      if (idSelectedPet) {
        const selected = pets.find((pet: Pet) => pet.id === idSelectedPet);
        setSelectedPet(selected);
      }
    };
    fetchData();
  }, []);

  return (
    <View flex bg-white padding-20>
      <View row gap-10>
        <Avatar.Image
          source={{
            uri: user?.picture,
          }}
          size={50}
        />
        <View centerV>
          <Text text60BL color={Colors.primaryColor}>{`${user?.name}`}</Text>
        </View>
      </View>
      <Text text70BO marginV-20>
        Registrar salud de tu mascota
      </Text>
      <ListSelectPet
        pets={pets}
        selectedPet={selectedPet}
        setSelectedPet={setSelectedPet}
      />
      <View marginT-10>
        <HealthTabController
          initialIndex={0}
          firstPage={
            <View>
              <FlatList
                data={pets}
                renderItem={({ item }) => <Text>{item.name}</Text>}
              />
            </View>
          }
          secondPage={<Text>Desparacitaciones</Text>}
        />
      </View>
    </View>
  );
};

export default PetHealth;
