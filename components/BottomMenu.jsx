import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors, Text, View } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";

const BottomMenu = () => {
  const navigation = useNavigation();
  const addNewPet = () => {
    navigation.navigate("RegisterNewPet");
  };

  const screenNavigate = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View paddingH-10 absB>
      <TouchableOpacity onPress={addNewPet}>
        <Text marginT-5>+ Mascotas</Text>
      </TouchableOpacity>
      <View marginB-10>
        <Text text70BO black marginT-5>
          MI ACTIVIDAD
        </Text>
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate("NotificationsTab")}>
        <View
          row
          spread
          centerV
          paddingV-15
          width={"100%"}
          style={{ borderBottomWidth: 0.2 }}
        >
          <View row gap-10 centerV marginL-10>
            <Icon name="bell-outline" size={25} color={Colors.red} />
            <Text text70>Notificaciones</Text>
          </View>
          <View row gap-10 centerV>
            <Text>0</Text>
            <Icon name="chevron-right" size={25} color={Colors.red} />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate("ProfileEditUser")}>
        <View
          row
          spread
          centerV
          paddingV-15
          width={"100%"}
          style={{ borderBottomWidth: 0.2 }}
        >
          <View row gap-10 centerV marginL-10>
            <Feather name="user" size={25} color={Colors.red} />
            <Text text70>Mi cuenta</Text>
          </View>
          <View row gap-10 centerV>
            <Icon name="chevron-right" size={25} color={Colors.red} />
          </View>
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity
        disabled={disabledOption}
        onPress={() => screenNavigate("IdMyPet")}
        style={[styles.section, disabledOption && {opacity: 0.5}]}
      >
        <View style={styles.sectionContainer}>
          <Image
            source={require("../assets/qr.png")}
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
            Notificaciones
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
            source={require("../assets/arrowRigth.png")}
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
            source={require("../assets/calendar.png")}
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
            source={require("../assets/arrowRigth.png")}
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
            source={require("../assets/bag.png")}
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
            source={require("../assets/arrowRigth.png")}
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
            source={require("../assets/images/cartilla-icon.png")}
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
            source={require("../assets/arrowRigth.png")}
            style={{ height: 15, width: 15 }}
            resizeMode={"contain"}
          />
        </View>
      </TouchableOpacity> */}
    </View>
  );
};

export default BottomMenu;
