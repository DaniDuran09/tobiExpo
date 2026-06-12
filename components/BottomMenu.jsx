import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Colors, Text, View } from "react-native-ui-lib";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import ApiFetcher from "../modules/ApiFetcher";
import { useState, useCallback } from "react";

const BottomMenu = () => {
  const navigation = useNavigation();
  const [unreadCount, setUnreadCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchUnread = async () => {
        try {
          const apiFetcher = new ApiFetcher();
          const response = await apiFetcher.getNotifications();
          const apiNotifications = response.data || [];
          const count = apiNotifications.filter(n => n.status !== "read" && n.status !== "readed").length;
          setUnreadCount(count);
        } catch (e) {
          console.log("Error fetching notifications for BottomMenu:", e);
        }
      };
      fetchUnread();
    }, [])
  );

  const addNewPet = () => {
    navigation.navigate("RegisterNewPet");
  };

  return (
    <View paddingH-10 absB marginB-20={Platform.OS === "android"} bg-white>
      <TouchableOpacity onPress={addNewPet}>
        <Text marginT-5>+ Mascotas</Text>
      </TouchableOpacity>
      <View marginB-10>
        <Text text70BO black marginT-5>
          MI ACTIVIDAD
        </Text>
      </View>
      <TouchableOpacity onPress={() => {
        navigation.navigate("NotificationsTab", { screen: "NotificationsHome" })
      }}>
        <View
          row
          spread
          centerV
          paddingV-15
          width={"100%"}
          style={{ borderBottomWidth: 0.5 }}
        >
          <View row gap-10 centerV marginL-10>
            <Icon name="bell-outline" size={25} color={Colors.red} />
            <Text text70>Notificaciones</Text>
          </View>
          <View row gap-10 centerV>
            <Text text70BO>{unreadCount > 0 ? unreadCount : ""}</Text>
            <Icon name="chevron-right" size={25} color={Colors.red} />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        navigation.navigate("AppointmentsHome")
      }}>
        <View
          row
          spread
          centerV
          paddingV-15
          width={"100%"}
          style={{ borderBottomWidth: 0.5 }}
        >
          <View row gap-10 centerV marginL-10>
            <Icon name="calendar" size={25} color={Colors.red} />
            <Text text70>Mis citas</Text>
          </View>
          <View row gap-10 centerV>
            <Icon name="chevron-right" size={25} color={Colors.red} />
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ProfileEditUserMenu")}>
        <View
          row
          spread
          centerV
          paddingV-15
          width={"100%"}
          style={{ borderBottomWidth: 0.5 }}
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
