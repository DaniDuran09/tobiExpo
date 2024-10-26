import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../../styles/Colors";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import ApiFetcher from "../../../modules/ApiFetcher";
import ViewLoading from "../../../components/ViewLoading";
import { AnimatedImage, LoaderScreen } from "react-native-ui-lib";

const IdMyPet = () => {
  const [pets, setPets] = useState({});
  const [loading, setLoading] = useState(true);

  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const list = await apiFetcher.getPets();
      if (list) setPets(list.data);
    } catch (e) {
      console.log("Error: ", e);
      Alert.alert("Ha ocurrido un error", "Inténtelo de nuevo más tarde");
    } finally {
      setLoading(false);
    }
  };

  const goToIdInfoPet = async (pet) => {
    setLoading(true);
    try {
      const response = await apiFetcher.getPetById(pet.id);
      let petById = response.data;
      petById.pet_breed = pet.pet_breed;
      navigation.navigate("IdInfoPet", { pet: petById });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const renderPets = (item) => {
    return (
      <TouchableOpacity style={styles.item} onPress={() => goToIdInfoPet(item)}>
        <View style={styles.leftSection}>
          <AnimatedImage
            source={{ uri: item?.picture }}
            style={styles.imageItem}
            loader={<LoaderScreen color={Colors.primaryColor} size={20} />}
            animationDuration={500}
          />
          {/* <Image
            source={{ uri: item.picture }}
            style={styles.imageItem}
            resizeMode="cover"
          /> */}
          <View style={styles.containerPetInfo}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemDescription}>
              {item.pet_breed.description}
            </Text>
          </View>
        </View>
        <View style={styles.RightSection}>
          <Image
            source={require("../../../assets/qr-icon.png")}
            style={{ width: 25, height: 25 }}
            resizeMode="cover"
          />
          <Text style={styles.moreInfo}>+ info</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {loading ? (
        <ViewLoading waitString="Espere" backgroundColor={Colors.white} />
      ) : (
        <View style={styles.container}>
          <View>
            <FlatList
              data={pets}
              renderItem={({ item }) => renderPets(item)}
              keyExtractor={(item) => item.id.toString()}
              style={styles.flatList}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default IdMyPet;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  item: {
    height: 130,
    paddingLeft: 15,
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    alignItems: "center",
    shadowColor: Colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginBottom: 10,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
  containerPetInfo: {
    marginLeft: 15,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageItem: {
    height: 90,
    width: 90,
    borderRadius: 11,
  },
  RightSection: {
    paddingRight: 15,
    alignItems: "center",
    paddingTop: 20,
  },
  moreInfo: {
    marginTop: 5,
    fontSize: 12,
  },
});
