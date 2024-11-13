import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import ApiFetcher from "../../modules/ApiFetcher";
import { FlatList } from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import momentTZ from "../../utils/moment";

const CompleteVaccinationList = (props) => {
  const { completedVaccines, petId } = props;
  const [vaccinationList, setVaccinationList] = useState([]);
  const [dewormingList, setDewormingList] = useState([]);

  const apiFetcher = new ApiFetcher();

  useEffect(() => {
    if (completedVaccines && completedVaccines.length > 0 && petId) {
      getVaccinesToThisPet();
    }
  }, [completedVaccines, petId]);

  const getVaccinesToThisPet = async () => {
    try {
      const response = await apiFetcher.getVaccines(
        petId
      );

      setDewormingList(response.data.dewormers)
      const allVaccines = response.data.vaccines;
      const combinedVaccines = allVaccines.map((vaccine) => {
        const completedVaccine = completedVaccines.find(
          (completed) => completed.vaccine_id === vaccine.id
        );

        return completedVaccine
          ? { ...completedVaccine, isCompleted: true, name: vaccine.name }
          : { ...vaccine, isCompleted: false };
      });

      setVaccinationList(combinedVaccines);
      console.log("Vaccination list: ", combinedVaccines);
    } catch (error) {
      console.error("Error fetching vaccines: ", error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View padding-10 row gap-10 centerV>
        <SimpleLineIcons
          name={item.isCompleted ? "check" : "close"}
          size={20}
          color={Colors.gray}
          style={
            item.isCompleted ? { color: Colors.green } : { color: Colors.red }
          }
        />
        <View>
        <Text text70>{item.name}</Text>
        <Text text90L>{item.isCompleted ? `Aplicada el ${momentTZ(item.application_day).format("DD/MM/YYYY")}` : "Vencida"}</Text>
        </View>
      </View>
    );
  };
  return (
    <View flex marginT-10 padding-10>
      <View backgroundColor={Colors.lightBlue} br20 padding-15>
        <View row centerV spread>
          <View row centerV gap-10>
            <Image
              source={require("../../assets/vaccines.png")}
              style={{ height: 20, width: 20 }}
              resizeMode={"contain"}
            />
            <Text text80BO>Esquema de vacunación</Text>
          </View>
          <Image
            source={require("../../assets/edit-date.png")}
            style={{ height: 15, width: 15 }}
            resizeMode={"contain"}
          />
        </View>
        <View>
          <FlatList data={vaccinationList} renderItem={renderItem} />
        </View>
      </View>
      <View backgroundColor={Colors.lightBlue} br20 padding-15 marginT-20>
        <View row centerV spread>
          <View row centerV gap-10>
            <Image
              source={require("../../assets/despa-black.png")}
              style={{ height: 20, width: 20 }}
              resizeMode={"contain"}
            />
            <Text text80BO>Desparacitaciones</Text>
          </View>
          <Image
            source={require("../../assets/edit-date.png")}
            style={{ height: 15, width: 15 }}
            resizeMode={"contain"}
          />
        </View>
        <View>
          <FlatList data={dewormingList} renderItem={renderItem} />
        </View>
      </View>
    </View>
  );
};

export default CompleteVaccinationList;
