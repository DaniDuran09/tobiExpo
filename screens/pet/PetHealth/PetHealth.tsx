import React, { useEffect, useState } from "react";

import { View, Text, AnimatedImage, LoaderScreen } from "react-native-ui-lib";

import HealthTabController from "../../../components/pet/Health/HealthTabController/HealthTabController";
import ListSelectPet from "../../../components/pet/Health/ListSelectPet/ListSelectPet";
import Loading from "../../../components/Loading";
import VaccinesPage from "../../../components/pet/Health/VaccinesPage";

import { useGetPetsQuery } from "../../../services/api/pets.api";
import { useGetProfileQuery } from "../../../services/api/user.api";
import {
  useGetVaccinationRecordsQuery,
  useGetVaccinesQuery,
} from "../../../services/api/health.api";

import { Colors } from "../../../styles/Colors";

import { useRoute } from "@react-navigation/native";
import DerwomersPage from "../../../components/pet/Health/DerwomersPage";

const PetHealth = () => {
  const route = useRoute();
  const { idSelectedPet, tabIndex } = route.params as { idSelectedPet: number, tabIndex: number };

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

  const { data: vaccineBrandsResponse, isLoading: isLoadingVaccineBrands } =
    useGetVaccinesQuery(selectedPet.id || idSelectedPet);
  const vaccineBrands = vaccineBrandsResponse?.data.vaccine_brands || [];
  const dewormersBrands = vaccineBrandsResponse?.data.dewormer_brands || [];

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
            <AnimatedImage
              source={{ uri: user?.picture || "" }}
              height={50}
              width={50}
              borderRadius={50}
              loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
              animationDuration={500}
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
              initialIndex={tabIndex}
              firstPage={
                <VaccinesPage
                  refreshData={refetchVaccines}
                  isLoading={
                    isLoadingPets || isLoadingVaccines || isLoadingVaccineBrands
                  }
                  vaccineBrands={vaccineBrands}
                  selectedPet={selectedPet}
                  allVaccines={allVaccines}
                />
              }
              secondPage={<DerwomersPage
                refreshData={refetchVaccines}
                isLoading={
                  isLoadingPets || isLoadingVaccines || isLoadingVaccineBrands
                }
                derwomersBrands={dewormersBrands}
                selectedPet={selectedPet}
                allDerwomers={allDewormers} />}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default PetHealth;
