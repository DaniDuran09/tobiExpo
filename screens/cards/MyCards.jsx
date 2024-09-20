import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../styles/Colors";
import AppStorage from "../../modules/AppStorage";
import { getCards } from "../../services";
import { useNavigation } from "@react-navigation/native";

const MyCards = () => {
  const [laoding, setLoading] = useState(true);
  const [cards, setCards] = useState([]);

  const appStorage = new AppStorage();
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await appStorage.getAppToken();
      const listCards = await getCards(token);
      console.log("Las cards del usuario: ", listCards);
      setCards(listCards.data);
    } catch (error) {
      console.log("Error en las cards: ", error);
    } finally {
      setLoading(false);
    }
  };

  const goToAddNewCard = () => {
    navigation.navigate("AddNewCard");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Mis tarjetas</Text>
      </View>
      <View style={styles.cardsContainer}>
        {cards.length > 0 ? (
          <View></View>
        ) : (
          <View style={styles.noCradsContainer}>
           
            <TouchableOpacity
              style={styles.addCardContainer}
              onPress={goToAddNewCard}
            >
              <Text style={styles.addCardText}>Agregar una nueva tarjeta</Text>
              <Image
                source={require("../../assets/plus-icon.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text style={styles.noCardsText}>
              Aún no tienes tarjetas registradas
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MyCards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "500",
  },
  addCardContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 100,
    alignItems: "center",
  },
  noCradsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  noCardsText: {
    color: Colors.gray,
    fontSize: 14,
    marginTop: 20
  },
  addCardText: {
    fontSize: 16,
    color: Colors.gray,
  },
});
