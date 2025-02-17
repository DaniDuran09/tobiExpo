import { Image, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "../../../styles/Colors";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import ApiFetcher from "../../../modules/ApiFetcher";
import Toast from "react-native-toast-message";
import momentTZ from "../../../utils/moment";
import { AnimatedImage, LoaderScreen, Text } from "react-native-ui-lib";
import Loading from "../../../components/Loading";

const History = ({ navigation }) => {
  const apiFetcher = new ApiFetcher();

  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(null);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    setLoading(true);
    try {
      const response = await apiFetcher.getAppointments();
      const appointmentCompleted = response.data.filter(
        (appointment) => appointment.appointment_status === "cancelled"
      );
      console.log("appointmentCompleted: ", appointmentCompleted);
      setHistory(appointmentCompleted);
    } catch (error) {
      console.log("Error: ", error);
      Toast.show({
        type: "error",
        text1: "Error al obtener el historial",
        text2: `Intenta de nuevo más tarde`,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderItem = (item) => {
    console.log("item: ", item);
    const dateTime = momentTZ(item?.date_service).format(
      "DD [de] MMM, h:mm [hrs]"
    );
    return (
      <View style={styles.containerInfo}>
        <AnimatedImage
          source={{ uri: item?.partner?.picture }}
          style={styles.image}
          loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
          animationDuration={500}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.infoTitle}>{item?.partner?.name}</Text>
          <Text style={styles.info}>{dateTime}</Text>
          <Text style={styles.info}>
            {item?.appointment_pet_services[0]?.service?.name}
          </Text>
          {/* <TouchableOpacity
            style={styles.priceContainer}
            onPress={() => navigation.navigate("RateService")}
          >
            <Text style={styles.infoPrice}>Valorar cita</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("Explore");
            }}
          >
            <Text style={styles.textButton}>Agrendar otra cita</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading && (
        <Loading
          textColor={Colors.primaryColor}
          backgroundColorProp={Colors.white}
        />
      )}
      <Text style={styles.title}>
        Aquí puedes ver todas las actividades de tu mascota
      </Text>
      <View style={styles.containerHistoryList}>
        <Text marginT-15></Text>
        <FlatList data={history} renderItem={({ item }) => renderItem(item)} />
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
    height: "100%",
  },
  containerInfo: {
    marginTop: 15,
    backgroundColor: Colors.lightBlue,
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
  },
  priceContainer: {
    borderWidth: 0.8,
    borderColor: Colors.primaryColor,
    marginTop: 12,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
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
});
