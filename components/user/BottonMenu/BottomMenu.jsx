import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native-ui-lib";

const BottomMenu = ({ disabledOption = false }) => {
  const navigation = useNavigation();
  const addNewPet = () => {
    navigation.navigate("RegisterNewPet");
  };

  const screenNavigate = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={addNewPet}>
        <Text marginT-5>+ Mascotas</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <Text text70BO black marginT-5>
          MI ACTIVIDAD
        </Text>
      </View>
      <TouchableOpacity
        disabled={disabledOption}
        onPress={() => screenNavigate("IdMyPet")}
        style={[styles.section, disabledOption && {opacity: 0.5}]}
      >
        <View style={styles.sectionContainer}>
          <Image
            source={require("../../../assets/qr.png")}
            style={styles.image}
            resizeMode={"contain"}
          />
        </View>
        <View
          style={{
            height: "100%",
            width: "70%",
            justifyContent: "center",
            alignItems: "flex-start",
            borderBottomWidth: 1,
            borderBottomColor: "grey",
          }}
        >
          <Text text70BO black>
            Id. digital de mi mascota
          </Text>
        </View>
        <View
          style={{
            height: "100%",
            width: "30%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "grey",
          }}
        >
          <Image
            source={require("../../../assets/arrowRigth.png")}
            style={{ height: 15, width: 15 }}
            resizeMode={"contain"}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
      disabled={disabledOption}
        onPress={() => screenNavigate("Appointments")}
        style={[styles.section, disabledOption && {opacity: 0.5}]}
      >
        <View
          style={{
            height: "100%",
            width: "10%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../../assets/calendar.png")}
            style={{ height: 20, width: 20 }}
            resizeMode={"contain"}
          />
        </View>
        <View
          style={{
            height: "100%",
            width: "70%",
            justifyContent: "center",
            alignItems: "flex-start",
            borderBottomWidth: 1,
            borderBottomColor: "grey",
          }}
        >
          <Text text70BO black>
            Mis citas
          </Text>
        </View>
        <View
          style={{
            height: "100%",
            width: "30%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "grey",
          }}
        >
          <Image
            source={require("../../../assets/arrowRigth.png")}
            style={{ height: 15, width: 15 }}
            resizeMode={"contain"}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
      disabled={disabledOption}
        onPress={() => screenNavigate("History")}
        style={[styles.section, disabledOption && {opacity: 0.5}]}
      >
        <View
          style={{
            height: "100%",
            width: "10%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../../assets/bag.png")}
            style={{ height: 20, width: 20 }}
            resizeMode={"contain"}
          />
        </View>
        <View
          style={{
            height: "100%",
            width: "70%",
            justifyContent: "center",
            alignItems: "flex-start",
            borderBottomWidth: 1,
            borderBottomColor: "grey",
          }}
        >
          <Text text70BO black>
            Historial
          </Text>
        </View>
        <View
          style={{
            height: "100%",
            width: "30%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            borderBottomWidth: 1,
            borderBottomColor: "grey",
          }}
        >
          <Image
            source={require("../../../assets/arrowRigth.png")}
            style={{ height: 15, width: 15 }}
            resizeMode={"contain"}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
      disabled={disabledOption}
        onPress={() => screenNavigate("SelectPetVaccines")}
        style={[styles.section, disabledOption && {opacity: 0.5}]}
      >
        <View
          style={{
            height: "100%",
            width: "10%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../../assets/images/cartilla-icon.png")}
            style={{ height: 20, width: 20 }}
            resizeMode={"contain"}
          />
        </View>
        <View
          style={{
            height: "100%",
            width: "70%",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text text70BO black>
            Cartilla de salud digitalizada
          </Text>
        </View>
        <View
          style={{
            height: "100%",
            width: "30%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Image
            source={require("../../../assets/arrowRigth.png")}
            style={{ height: 15, width: 15 }}
            resizeMode={"contain"}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BottomMenu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "33%",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    color: "black",
    fontWeight: "700",
    paddingTop: 15,
  },
  section: {
    height: "18%",
    width: "100%",
    flexDirection: "row",
  },
  sectionContainer: {
    height: "100%",
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { height: 20, width: 20 },
});
