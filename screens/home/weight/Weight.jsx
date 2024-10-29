import { Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Colors } from "../../../styles/Colors";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Recomendation from "../../../components/Recomendation";
import ChallengeModal from "../../../components/ChallengeModal";
import { useNavigation } from "@react-navigation/native";

const Weight = (props) => {
  const { item } = props;
  console.log("item: ", item);
  const [success, setSuccess] = useState(false);
  const navigation = useNavigation();
  const [challengeVisible, setChallengeVisible] = useState(false);
  const closeModalChallenge = () => {
    setChallengeVisible(false);
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.realWeightContainer}>
          <View style={styles.statusContainer}>
            <Image
              source={require("../../../assets/balance.png")}
              style={styles.imageBalance}
            />
            <Text style={styles.realText}>Real</Text>
          </View>
          <Text style={styles.kgText}>
            {parseInt(item.weight_status.weight)} kg
          </Text>
          <Text style={styles.lastUpdate}>Último registro --.--.--</Text>
          <TouchableOpacity style={styles.updateButton} onPress={() => {}}>
            <Text style={styles.updateTetx}>Actualizar peso real</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.realWeightContainer}>
          <View style={styles.statusContainer}>
            <Image
              source={require("../../../assets/balance.png")}
              style={styles.imageBalance}
            />
            <Text style={styles.realText}>Rango ideal</Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: "black",
              fontWeight: "bold",
              marginTop: 10
            }}
          >{`${(item?.weight_status?.ideal_weight?.from??0) / 1000} Kg - ${
            (item?.weight_status?.ideal_weight?.to??0) / 1000
          } Kg`}</Text>
          <View style={styles.triangleContianer}>
            <Icon name="triangle" size={20} color={Colors.red} 
              style={{transform: [{ rotate: item.weight_status.weight > (item.weight_status.ideal_weight?.to??0)/1000 ? '0deg' : '180deg' }]}}
            />
            <Text style={styles.weightPoints}>...</Text>
          </View>
        </View>
        {success ? (
          <View style={styles.successWeight}>
            <View style={styles.successIconAndText}>
              <Icon name="thumb-up-outline" size={20} color={Colors.green} />
              <View>
                <Text style={styles.goodText}>¡Bien hecho! </Text>
                <Text style={styles.infoText}>
                  Tu mascota está dentro del rango de su peso ideal.{" "}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Recomendation
            title={"Recomendación"}
            info={
              "Programa una cita con un especialista en nutrición para el cuidado de tu mascota."
            }
            setVisible={setChallengeVisible}
          />
        )}
        <ChallengeModal
          closeModalChallenge={closeModalChallenge}
          challengeVisible={challengeVisible}
          text={
            "Te aconsejamos realizar la actividad recomendada para tu mascota."
          }
        />
      </View>
    </ScrollView>
  );
};

export default Weight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  realWeightContainer: {
    backgroundColor: Colors.mediumWhite,
    padding: 15,
    borderRadius: 8,
    marginBottom: "5%",
  },
  imageBalance: {
    width: 20,
    height: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  realText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "600",
  },
  kgText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primaryColor,
  },
  lastUpdate: {
    marginTop: 25,
    fontWeight: "300",
  },
  updateButton: {
    marginTop: 10,
  },
  updateTetx: {
    textDecorationLine: "underline",
    fontWeight: "500",
  },
  textWeight: {
    marginTop: 25,
    color: Colors.primaryColor,
    marginLeft: 10,
  },
  triangleContianer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  weightPoints: {
    marginLeft: 3,
    color: Colors.primaryColor,
  },
  successWeight: {
    borderWidth: 1,
    borderColor: Colors.green,
    padding: 15,
    borderRadius: 8,
  },
  successIconAndText: {
    flexDirection: "row",
    gap: 10,
    width: "90%",
  },
  goodText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "300",
  },
  containerInfo: {
    marginTop: 15,
    backgroundColor: Colors.pink,
    padding: 20,
    borderRadius: 8,
    flexDirection: "row",
    gap: 15,
  },
  image: {
    width: 140,
    height: 180,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  info: {
    fontSize: 16,
    marginTop: 12,
    color: Colors.primaryColor,
  },
  priceContainer: {
    borderWidth: 0.8,
    borderColor: Colors.primaryColor,
    marginTop: 12,
    borderRadius: 4,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  infoPrice: {
    color: Colors.primaryColor,
  },
  button: {
    marginTop: 12,
  },
  textButton: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
  containerLetters: {
    width: "50%",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
});
