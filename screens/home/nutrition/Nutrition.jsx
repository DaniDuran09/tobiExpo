import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  gradientColors,
  gradientColorsModal,
} from "../../../styles/Colors";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import InfoModal from "../../../components/InfoModal";
import ChallengeModal from "../../../components/ChallengeModal";

const Nutrition = () => {
  const [infoVisible, setInfoVisible] = useState(false);
  const [challengeVisible, setChallengeVisible] = useState(false);
  const closeModal = () => {
    setInfoVisible(false);
  };
  const closeModalChallenge = () => {
    setChallengeVisible(false);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cuántas veces debe comer tu mascota?</Text>
      <Text style={styles.title}>¿Cuántos gramos al día?</Text>
      <Text style={styles.text}>
        Del producto que actualmente consume tu mascota te sugerimos:
      </Text>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={styles.infoContainer}
      >
        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendation}>3 veces al día</Text>
          <TouchableOpacity
            style={styles.infoIcon}
            onPress={() => setInfoVisible(true)}
          >
            <Icon name="information-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.portionContainer}>
          <Image
            source={require("../../../assets/dishFood.png")}
            style={styles.dishFood}
            resizeMode="contain"
          />
          <Text style={styles.portion}>100</Text>
          <View>
            <Text style={styles.moreText}>total</Text>
            <Text style={styles.moreText}>gramos</Text>
            <Text style={styles.moreText}>diarios</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.footer}
          onPress={() => setChallengeVisible(true)}
        >
          <Text style={styles.textFooter}>ACEPTO EL RETO</Text>
        </TouchableOpacity>
      </LinearGradient>
      <InfoModal
        closeModal={closeModal}
        infoVisible={infoVisible}
        title={"Ingesta diaria recomendada"}
        description={
          "El total de gramos diarios se dividen entre las veces recomendadas para tu mascota."
        }
      />
      <ChallengeModal
        closeModalChallenge={closeModalChallenge}
        challengeVisible={challengeVisible}
        text={"Hola, escuché que abriste una bolsa. ¡Sí quiero!"}
      />
    </View>
  );
};

export default Nutrition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "8%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    fontWeight: "300",
  },
  infoContainer: {
    marginTop: "5%",
    borderRadius: 20,
    padding: 10,
    width: "100%",
    height: "60%",
    backgroundColor: Colors.primaryColor,
  },
  recommendation: {
    marginLeft: "10%",
    color: Colors.white,
    fontSize: 16,
    fontWeight: "900",
  },
  portionContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: "10%",
  },
  dishFood: {
    width: "30%",
    height: "100%",
  },
  portion: {
    fontSize: 80,
    fontWeight: "800",
    color: Colors.white,
  },
  moreText: {
    fontSize: 16,
    fontWeight: "400",
    color: Colors.white,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
  },
  textFooter: {
    fontSize: 22,
    textDecorationLine: "underline",
    color: Colors.white,
    fontWeight: "300",
  },
  recommendationContainer: {
    marginTop: "10%",
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginLeft: 5,
  },
});
