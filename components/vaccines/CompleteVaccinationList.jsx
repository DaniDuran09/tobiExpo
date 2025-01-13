import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import ApiFetcher from "../../modules/ApiFetcher";
import { FlatList } from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import momentTZ from "../../utils/moment";
import VaccineCard from "../VaccineCard";
import EmptyVaccines from "./EmptyVaccines";

const CompleteVaccinationList = (props) => {
  const {
    completedVaccines,
    petId,
    registerVaccines,
    registerDewormings,
    vaccinesCompleted,
    dewromingsCompleted,
  } = props;
  const [vaccinationList, setVaccinationList] = useState({
    applied: [],
    notApplied: [],
  });
  const [dewormingList, setDewormingList] = useState([]);

  const apiFetcher = new ApiFetcher();

  const emptyDeworming = {
    item: {
      name: "Desparacitación",
      isCompleted: false,
    },
  };

  useEffect(() => {
    if (completedVaccines && petId) {
      getVaccinesToThisPet();
    }
  }, [completedVaccines, petId]);

  const getVaccinesToThisPet = async () => {
    try {
      const vaccinesResponse = await apiFetcher.getVaccinesRecords(petId);
      if (vaccinesResponse.data.vaccines_records.length > 0) {
        setVaccinationList({
          applied: vaccinesResponse.data.vaccines_records.map((vaccine) => ({
            ...vaccine,
            isCompleted: true,
          })),
          notApplied: vaccinesResponse.data.vaccines_expired.map((vaccine) => ({
            ...vaccine,
            isCompleted: false,
          })),
        });
      }
      // console.log("vaccinesResponse.data.dewormers_records.length: ", petId)
      if (vaccinesResponse.data.dewormers_records.length > 0) {
        setDewormingList(
          vaccinesResponse.data.dewormers_records.map((dewomer) => ({
            ...dewomer,
            name: dewomer.deworming_type,
            isCompleted: true,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching vaccines: ", error);
    }
  };
  // const renderItem = ({ item }) => {
  //   const { isCompleted, name, next_dose } = item;
  //   return (
  //     <View padding-10 row gap-10 centerV>
  //       <SimpleLineIcons
  //         name={isCompleted ? "check" : "close"}
  //         size={20}
  //         style={{
  //           color: item.isCompleted ? Colors.green : Colors.red,
  //         }}
  //       />
  //       <View>
  //         <Text text70>{name}</Text>
  //         <Text text90L>
  //           {item.isCompleted
  //             ? `Vencimiento ${momentTZ(next_dose).format("DD.MM.YYYY")}`
  //             : "Vencida"}
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // };

  return (
    <View flex marginT-10 padding-10>
      {/* {!vaccinesCompleted && ( */}
      <View marginH-15 row spread>
        <Text text70M color={Colors.primaryColor}>
          Vacunas
        </Text>
        <TouchableOpacity onPress={registerVaccines}>
          <Image
            source={require("../../assets/edit-icon.png")}
            style={{ height: 25, width: 25 }}
            resizeMode={"contain"}
          />
        </TouchableOpacity>
      </View>
      {/* )} */}
      {/* <View backgroundColor={Colors.lightBlue} br20 padding-15>
        <View row centerV spread>
          <View row centerV gap-10>
            <Image
              source={require("../../assets/vaccines.png")}
              style={{ height: 20, width: 20 }}
              resizeMode={"contain"}
            />
            <Text text80BO>Esquema de vacunación</Text>
          </View>
          {/* <Image
            source={require("../../assets/edit-date.png")}
            style={{ height: 15, width: 15 }}
            resizeMode={"contain"}
          /> 
        </View>
        <View>
          <FlatList
            data={[...vaccinationList.applied, ...vaccinationList.notApplied]}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
      */}
      <FlatList
        data={[...vaccinationList.applied, ...vaccinationList.notApplied]}
        renderItem={(vaccine) => <VaccineCard info={vaccine} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEnabled={false}
        ListEmptyComponent={
          <EmptyVaccines
            text={"Registra las vacunas de tu mascota en la sección de SALUD"}
          />
        }
      />
      {/* <View backgroundColor={Colors.lightBlue} br20 padding-15 marginT-20>
        <View row centerV spread>
          <View row centerV gap-10>
            <Image
              source={require("../../assets/despa-black.png")}
              style={{ height: 20, width: 20 }}
              resizeMode={"contain"}
            />
            <Text text80BO>Desparacitaciones</Text>
          </View>
          {/* <Image
            source={require("../../assets/edit-date.png")}
            style={{ height: 15, width: 15 }}
            resizeMode={"contain"}
          /> 
        </View>
        <View>
          <FlatList
            data={dewormingList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View> */}
      
      <View marginH-15 row spread>
        <Text text70M color={Colors.primaryColor}>
          Desparacitaciones
        </Text>
        {!dewromingsCompleted && (
        <TouchableOpacity onPress={registerDewormings}>
          <Image
            source={require("../../assets/edit-icon.png")}
            style={{ height: 25, width: 25 }}
            resizeMode={"contain"}
          />
        </TouchableOpacity>
        )}
      </View>
    
      <FlatList
        data={dewormingList}
        renderItem={(deworming) => <VaccineCard info={deworming} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEnabled={false}
        ListEmptyComponent={<VaccineCard info={emptyDeworming} />}
      />
    </View>
  );
};

export default CompleteVaccinationList;
