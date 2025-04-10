import React, { useEffect, useState } from "react";

import { View, Text } from "react-native-ui-lib";

import HealthTabController from "../../../components/pet/Health/HealthTabController/HealthTabController";
import ListSelectPet from "../../../components/pet/Health/ListSelectPet/ListSelectPet";
import Loading from "../../../components/Loading";
import VaccinesPage from "../../../components/pet/Health/VaccinesPage";

import { useGetPetsQuery } from "../../../services/api/pets.api";
import { useGetProfileQuery } from "../../../services/api/user.api";
import { useGetVaccinationRecordsQuery } from "../../../services/api/health.api";

import { Colors } from "../../../styles/Colors";

import { Avatar } from "react-native-paper";
import { useRoute } from "@react-navigation/native";


const PetHealth = () => {
  const route = useRoute();
  const { idSelectedPet } = route.params as { idSelectedPet: number };

  const [selectedPet, setSelectedPet] = useState<Pet>({} as Pet);
  const [allVaccines, setAllVaccines] = useState<any[]>([]);
  const [allDewormers, setAllDewormers] = useState<any[]>([]);

  const { data: petsResponse, isLoading: isLoadingPets } = useGetPetsQuery();
  const pets = petsResponse?.data || [];

  const { data: userResponse, isLoading: isLoadingUser } = useGetProfileQuery();
  const user = userResponse?.data || ({ picture: "", name: "" } as User);

  const {
    data: vaccinesResponse,
    refetch: refetchVaccines,
    isLoading: isLoadingVaccines,
  } = useGetVaccinationRecordsQuery(selectedPet.id || idSelectedPet);
  const vaccines = vaccinesResponse?.data || [];

  useEffect(() => {
    refetchVaccines();

    if (vaccines?.vaccines_records || vaccines?.vaccines_expired) {
      const vaccinesList = [
        ...(vaccines.vaccines_records || []),
        ...(vaccines.vaccines_expired || []),
      ];

      setAllVaccines(vaccinesList);

      const dewormersList = [
        ...(vaccines.dewormers_records || []),
        ...(vaccines.dewormers_expired || []),
      ];
      setAllDewormers(dewormersList);
    }
  }, [vaccines, selectedPet]);

  useEffect(() => {
    if (idSelectedPet && pets.length > 0) {
      const selected = pets.find((pet: Pet) => pet.id === idSelectedPet);
      if (selected) {
        setSelectedPet(selected);
      }
    }
  }, [pets]);

  return (
    <View flex bg-white padding-20>
      {isLoadingPets || isLoadingUser || isLoadingVaccines ? (
        <Loading
          backgroundColor={Colors.white}
          textColor={Colors.primaryColor}
        />
      ) : (
        <>
          <View row gap-10>
            <Avatar.Image
              source={{
                uri: user?.picture,
              }}
              size={50}
            />
            <View centerV>
              <Text
                text60BL
                color={Colors.primaryColor}
              >{`${user?.name}`}</Text>
            </View>
          </View>
          <Text text70BO marginV-20>
            Registrar salud de tu mascota
          </Text>
          <ListSelectPet
            pets={pets as Pet[]}
            selectedPet={selectedPet}
            setSelectedPet={setSelectedPet}
          />
          <View marginT-10>
            <HealthTabController
              initialIndex={0}
              firstPage={
                <VaccinesPage
                  selectedPet={selectedPet}
                  allVaccines={allVaccines}
                />
              }
              secondPage={<Text>Desparacitaciones</Text>}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default PetHealth;
