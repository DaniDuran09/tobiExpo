import React, { useEffect, useState } from "react";
import { ScrollView, RefreshControl } from "react-native";

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
import momentTZ from "../../../utils/moment";

const PetHealth = () => {
  const route = useRoute();
  const { idSelectedPet, tabIndex } = route.params as {
    idSelectedPet: number;
    tabIndex: number;
  };

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
    isFetching: isFetchingVaccines,
  } = useGetVaccinationRecordsQuery(selectedPet.id || idSelectedPet);
  const vaccines = vaccinesResponse?.data || [];

  const { data: vaccineBrandsResponse, isLoading: isLoadingVaccineBrands } =
    useGetVaccinesQuery(selectedPet.id || idSelectedPet);
  const vaccineBrands = vaccineBrandsResponse?.data.vaccine_brands || [];
  const dewormersBrands = vaccineBrandsResponse?.data.dewormer_brands || [];

  useEffect(() => {
    refetchVaccines();

    console.log(`\n\n=== REPORTE PARA BACKEND ===`);
    console.log(`Endpoint: /v1/portal_client/pets/${selectedPet.id || idSelectedPet}/vaccination_records`);
    console.log(`Mascota: ${selectedPet.name || "Desconocida"} (Pet ID: ${selectedPet.id || idSelectedPet})`);
    console.log(`Payload puro recibido del backend:`);
    console.log(JSON.stringify(vaccines, null, 2));
    console.log(`============================\n\n`);

    const calculateDaysRemaining = (record: any) => {
      let days_remaining;
      if (record.next_dose) {
        const parsed = momentTZ(record.next_dose, ["YYYY-MM-DD", "DD/MM/YYYY", "DD-MM-YYYY"]);
        if (parsed.isValid()) {
          days_remaining = parsed.diff(momentTZ().startOf("day"), "days");
        }
      }
      return days_remaining;
    };

    // IGNORAR nextstep y toexpire
    const unappliedVaccines = vaccines?.vaccines_expired || vaccines?.expired_vaccines || [];
    const baseVaccinesRaw = [
      ...(vaccines?.vaccines_records || []), 
      ...unappliedVaccines
    ];

    const unappliedDewormers = vaccines?.dewormers_expired || vaccines?.expired_dewormers || [];
    const baseDewormersRaw = [
      ...(vaccines?.dewormers_records || []), 
      ...unappliedDewormers
    ];

    // Deduplicación para sobrepasar la inconsistencia de IDs del backend
    const filterUnique = (arr: any[], type: "vaccine" | "dewormer") => {
      const map = new Map();
      arr.forEach((item) => {
        const isApplied = item.applied || item.application_day;
        
        let name = "";
        if (type === "vaccine") {
          name = item.name?.trim().toLowerCase() || "";
        } else {
          name = (item.deworming_type || item.description || item.name || "").replace("Desparasitación ", "").trim().toLowerCase();
        }
        
        if (!map.has(name)) {
          map.set(name, item);
        } else {
          // Si ya existe, darle prioridad al que SÍ esté aplicado
          const existing = map.get(name);
          if (isApplied && !(existing.applied || existing.application_day)) {
            map.set(name, item);
          }
        }
      });
      return Array.from(map.values());
    };

    const mapUid = (v: any) => ({
      ...v,
      uid: `${v.id}-${!v.applied && !v.application_day ? 'pending' : 'applied'}`
    });

    const allVaccinesMerged = filterUnique(baseVaccinesRaw, "vaccine").map(mapUid);
    const allDewormersMerged = filterUnique(baseDewormersRaw, "dewormer").map(mapUid);

    const processedVaccines = allVaccinesMerged.map((record: any) => ({
      ...record,
      days_remaining: record.days_remaining !== undefined ? record.days_remaining : calculateDaysRemaining(record),
    }));

    const processedDewormers = allDewormersMerged.map((dewormer: any) => ({
      ...dewormer,
      days_remaining: dewormer.days_remaining !== undefined ? dewormer.days_remaining : calculateDaysRemaining(dewormer),
      deworming_type_toRegister: !dewormer.applied
        ? dewormer?.description?.replace("Desparasitación ", "").charAt(0).toUpperCase() +
        dewormer?.description?.replace("Desparasitación ", "").slice(1)
        : dewormer?.deworming_type,
    }));

    console.log("Mapped Vaccines:", JSON.stringify(processedVaccines, null, 2));
    console.log("Mapped Dewormers:", JSON.stringify(processedDewormers, null, 2));

    setAllVaccines(processedVaccines);
    setAllDewormers(processedDewormers);
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
    <View flex bg-white>
      <ScrollView
        contentContainerStyle={{ padding: 20, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingVaccines || isFetchingVaccines}
            onRefresh={refetchVaccines}
            colors={[Colors.primaryColor]}
            tintColor={Colors.primaryColor}
          />
        }
      >
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
                      isLoadingPets || isLoadingVaccines || isLoadingVaccineBrands || isFetchingVaccines
                    }
                    vaccineBrands={vaccineBrands}
                    selectedPet={selectedPet}
                    allVaccines={allVaccines}
                  />
                }
                secondPage={
                  <DerwomersPage
                    refreshData={refetchVaccines}
                    isLoading={
                      isLoadingPets || isLoadingVaccines || isLoadingVaccineBrands || isFetchingVaccines
                    }
                    derwomersBrands={dewormersBrands}
                    dewormersFrequency={vaccinesResponse?.data?.dewormers_frequency}
                    selectedPet={selectedPet}
                    allDerwomers={allDewormers}
                  />
                }
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default PetHealth;