import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "../../../styles/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";

const History = ({navigation}) => {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Aquí puedes ver todas las actividades de tu mascota
      </Text>
      <View style={styles.containerHistoryList}>
        <View>
          <Text>Enero 2024</Text>
          <View style={styles.containerInfo}>
            <Image source={require('../../../assets/prueba.png')} style={styles.image}/>
            <View>
              <Text style={styles.infoTitle}>Clinica de la esquina</Text>
              <Text style={styles.info}>12 Ene 24, 15:00</Text>
              <Text style={styles.info}>Radiografía</Text>
              <TouchableOpacity 
              style={styles.priceContainer}
              onPress={()=>navigation.navigate("RateService")}
              >
                <Text style={styles.infoPrice}>Valorar cita</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={()=>{
                navigation.navigate("Explore")
              }}>
                <Text style={styles.textButton}>Agrendar otra cita</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
  },
  title: {
    fontSize: 18,
    color: Colors.gray,
    marginTop: 15,
  },
  containerHistoryList: {
    marginTop: "10%",
  },
  containerInfo: {
    marginTop: 15,
    backgroundColor: Colors.lightBlue,
    padding: 20,
    borderRadius: 8,
    flexDirection: "row",
    gap: 15
  },
  image: {
    width: 140,
    height: 180
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700"
  },
  info: {
    fontSize: 16,
    marginTop: 12
  },
  priceContainer: {
    borderWidth: 0.8,
    borderColor: Colors.primaryColor,
    marginTop: 12,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    padding: 8
  },
  infoPrice: {
    color: Colors.primaryColor
  },
  button: {
    marginTop: 12
  },
  textButton: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
