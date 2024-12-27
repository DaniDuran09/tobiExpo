import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, gradientColors } from "../../styles/Colors";
import WithoutPhoto from "../../components/WithoutPhoto";
import ApiFetcher from "../../modules/ApiFetcher";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import VaccineCard from "../../components/VaccineCard";
import EmptyVaccines from "../../components/vaccines/EmptyVaccines";
import Loading from "../../components/Loading";
import Recomendation from "../../components/Recomendation";

const PetVaccinesRecord = ({ route }) => {
  const { id } = route.params;

  const [option, setOption] = useState(1);
  const [loadData, setLoadData] = useState(false);
  const [vaccines, setVaccines] = useState(null);
  const [petInfo, setPetInfo] = useState(null);
  const [vaccinationList, setVaccinationList] = useState([]);
  const [dewormingList, setDewormingList] = useState([]);

  const apiFetcher = new ApiFetcher();

  useEffect(() => {
    getPetInfo();
  }, []);

  // const getVaccinesToThisPet = async (completedVaccines) => {
  //   console.log(completedVaccines);
  //   try {
  //     const response = await apiFetcher.getVaccines(id);

  //     setDewormingList(response.data.dewormers);
  //     const allVaccines = response.data.vaccines;
  //     const combinedVaccines = allVaccines.map((vaccine) => {
  //       const completedVaccine = completedVaccines.find(
  //         (completed) => completed.vaccine_id === vaccine.id
  //       );

  //       return completedVaccine
  //         ? { ...completedVaccine, isCompleted: true, name: vaccine.name }
  //         : { ...vaccine, isCompleted: false };
  //     });

  //     console.log("combinedVaccines: ", combinedVaccines)

  //     setVaccinationList(combinedVaccines);

  //   } catch (error) {
  //     console.error("Error fetching vaccines: ", error);
  //   }
  // };

  const getPetInfo = async () => {
    setLoadData(true);
    try {
      const petResponse = await apiFetcher.getPetById(id);
      if (petResponse.code == 200) setPetInfo(petResponse.data);
      {
        const vaccinesResponse = await apiFetcher.getVaccinesRecords(id);
        console.log("vaccinesResponse: ", vaccinesResponse.data);
        if (vaccinesResponse.data.vaccines_records.length > 0) {
          // getVaccinesToThisPet(vaccinesResponse.data);
          setVaccinationList(vaccinesResponse.data.vaccines_records);
        }
      }
    } catch (error) {
      console.log("Error: ", error);

      Toast.show({
        type: "error",
        text1: "Error mascota no encontrada",
        text2: `Inténte de nuevo más tarde`,
      });
    } finally {
      setLoadData(false);
    }
  };

  console.log("pet: ", petInfo)

  return (
    <View style={styles.container}>
      {loadData && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      <View style={styles.headerContainer}>
        {petInfo?.picture ? (
          <Image
            source={{ uri: petInfo.picture }}
            style={styles.image}
            resizeMode={"cover"}
          />
        ) : (
          <WithoutPhoto />
        )}
        <Text style={styles.petName}>{petInfo?.name}</Text>
        <Text style={styles.infoPet}>
          {petInfo?.age} años | {petInfo?.gender == "male" ? "Macho" : "Hembra"}{" "}
          | {petInfo?.pet_breed.name}
        </Text>
      </View>
      <View style={styles.selectContainer}>
        <TouchableOpacity
          style={option === 1 ? styles.optionSelected : {}}
          onPress={() => setOption(1)}
        >
          <Text style={option === 1 ? styles.selected : styles.notSelected}>
            Cartilla de vacunación
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={option === 2 ? styles.optionSelected : {}}
          onPress={() => setOption(2)}
        >
          <Text style={option === 2 ? styles.selected : styles.notSelected}>
            Desparacitaciones
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
      <Recomendation
        title={"Recomendación"}
        info={
          "Programa una cita con un especialista para completar el esquema de salud de tu mascota."
        }
        oneOption={true}
      />
      <FlatList
        data={vaccinationList}
        renderItem={(vaccine) => <VaccineCard info={vaccine} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEnabled={false}
        ListEmptyComponent={<EmptyVaccines text={'Registra las vacunas de tu mascota en la sección de SALUD'}/>}
      />
      </ScrollView>
    </View>
  );
};

export default PetVaccinesRecord;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    padding: 10,
  },
  headerContainer: {
    alignItems: "center",
  },
  infoPet: {
    fontSize: 14,
    color: "black",
    fontWeight: "300",
    marginTop: 10,
  },
  petName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray,
    marginTop: "2%",
  },
  image: {
    height: 120,
    width: 120,
    zIndex: 0,
    borderRadius: 60,
  },
  selectContainer: {
    justifyContent: "center",
    flexDirection: "row",
    gap: 20,
    marginTop: 30,
    paddingBottom: 0,
  },
  selected: {
    color: Colors.primaryColor,
    fontWeight: "600",
    fontSize: 16,
  },
  notSelected: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.gray,
  },
  optionSelected: {
    borderBottomColor: Colors.primaryColor,
    borderBottomWidth: 2,
  },
  containerVaccinesInfo: {
    height: "70%",
  },
});
