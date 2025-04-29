import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../../../styles/Colors";

const FinishScreen = () => {
  return (
    <View style={styles.containerSelectSection}>
      <View style={styles.containerVaccinesSections}>
        <Image
          source={require("../../../assets/vaccines.png")}
          style={styles.vaccinesImage}
        />
        <View>
          <View style={styles.vaccine}>
            <Text style={styles.vaccineName}>Esquema de vacunación</Text>
          </View>
          <View style={styles.vaccine}>
            <Icon name="check-circle-outline" size={25} color={Colors.green} />

            <View>
              <Text style={styles.vaccineName}>Quíntuple/ Múltiple</Text>
              <Text>· Parvovirus</Text>
              <Text>· Moquillo</Text>
              <Text>· Adenovirus</Text>
              <Text>· Parainfluenza</Text>
              <Text>· Leptospira</Text>
              <Text>DD.MM.AA</Text>
            </View>
          </View>
          <View style={styles.vaccine}>
            <Icon name="check-circle-outline" size={25} color={Colors.green} />

            <View>
              <Text style={styles.vaccineName}>Bordetella</Text>
              <Text>DD.MM.AA</Text>
            </View>
          </View>
          <View style={styles.vaccine}>
            <Icon name="check-circle-outline" size={25} color={Colors.green} />

            <View>
              <Text style={styles.vaccineName}>Giardia</Text>
              <Text>DD.MM.AA</Text>
            </View>
          </View>
          <View style={styles.vaccine}>
            <Icon name="check-circle-outline" size={25} color={Colors.green} />

            <View>
              <Text style={styles.vaccineName}>Antirrábica</Text>
              <Text>DD.MM.AA</Text>
            </View>
          </View>
          <View style={styles.vaccine}>
            <Icon name="check-circle-outline" size={25} color={Colors.green} />

            <View>
              <Text style={styles.vaccineName}>Coronavirus</Text>
              <Text>DD.MM.AA</Text>
            </View>
          </View>
          <View style={styles.vaccine}>
            <Icon name="check-circle-outline" size={25} color={Colors.green} />

            <View>
              <Text style={styles.vaccineName}>Leishmaniosis</Text>
              <Text>DD.MM.AA</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.containerVaccinesSections}>
        <Image
          source={require("../../../assets/despa-black.png")}
          style={styles.vaccinesImage}
          resizeMode="contain"
        />
        <View>
          <View style={styles.vaccine}>
            
              <Icon
                name="check-circle-outline"
                size={25}
                color={Colors.green}
              />

              <View>
                <Text style={styles.vaccineName}>Desparasitación</Text>
              </View>
            
          </View>
          <View style={[styles.vaccine, { marginLeft: "20%" }]}>
            <View>
              <Text style={styles.vaccineName}>Mensual</Text>
            </View>
          </View>
          <View style={[styles.vaccine, { marginLeft: "20%" }]}>
            <View>
              <Text style={styles.vaccineName}>Interna - Externa</Text>
              <Text style={styles.despaDate}>DD.MM.AA</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FinishScreen;

const styles = StyleSheet.create({
  containerSelectSection: {
    marginTop: "10%",
  },
  containerVaccinesSections: {
    marginTop: "5%",
    backgroundColor: Colors.lightBlue,
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  vaccinesImage: {
    height: 30,
    width: 30,
    marginTop: 10,
    marginLeft: 10,
  },
  vaccine: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
    marginLeft: 10,
  },
  vaccineName: {
    fontSize: 18,
    fontWeight: "500",
  },
  despaDate: {
    marginTop: 15,

  }
});
