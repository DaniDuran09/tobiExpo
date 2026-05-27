import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { Colors } from "../../styles/Colors";
import AppStorage from "../../modules/AppStorage";
import { getPartens } from "../../services";
import { useNavigation } from "@react-navigation/native";
import ApiFetcher from "../../modules/ApiFetcher";
import { AnimatedImage, LoaderScreen, SkeletonView } from "react-native-ui-lib";
import * as Location from 'expo-location';

const SelectService = ({ route }) => {
  const { type, serviceId, petId, q } = route.params || {};
  const [listPartners, setListPartners] = useState([]);
  const [pets, stePets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  const [serviceData, setServiceData] = useState({
    name: "",
    description: "",
    status: "",
    category: ""
  });

  const isFromNotification = !!q;

  const appStorage = new AppStorage();
  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(loc.coords);
      } catch (error) {
        console.log('Error getting location:', error);
      }
    })();
  }, []);

  useEffect(() => {
    if (q) {
      setServiceData((prev) => ({
        ...prev,
        name: q,
        category: "Servicio sugerido",
      }));
    }
    fetchData();
  }, [q, location]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const partners = await apiFetcher.getPartners({
        q: q,
        lat: location?.latitude,
        lng: location?.longitude
      });
      if (partners.code == 200 || partners.code == 201)
        setListPartners(partners.data);
    } catch (error) {
      console.log("Error: ", error);
      Alert.alert("Ha ocurrido un error", "Inténtelo de nuevo más tarde");
    } finally {
      setLoading(false);
    }
  };

  const goToMoreInfo = (item, type) => {
    navigation.navigate("PartnersGeneralInfo", { id: item.id, type: type, petId, serviceId, q });
  };

  const ExpandableText = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text numberOfLines={expanded ? undefined : 1}
          style={styles.itemDescription}
        >
          {text}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderPartners = ({ item }) => (
    <TouchableOpacity
      onPress={() => goToMoreInfo(item, item.type_partner?.id || 2)}
      style={styles.item}
    >
      <View
        style={styles.item2}>
        <View style={styles.leftSection}>
          <AnimatedImage
            source={{ uri: item?.picture }}
            style={styles.imageItem}
            loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
            animationDuration={500}
            resizeMode="contain"
          />
        </View>
        <View style={styles.RightSection}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <ExpandableText
            text={item.description}
          />
          <View style={styles.rating}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Text key={i}>
                {i < item.rating ? "⭐" : "☆"}
              </Text>
            ))}
            <Text> {item.rating}</Text>
          </View>

        </View>
      </View>
      <View style={styles.footer}>
        <Text>
          📍 Circuito Misioneros 4-A, Naucalpan de Juá...
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => {
    if (loading) return <LoaderScreen color={Colors.primaryColor} />;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {q
            ? `Actualmente los partners no ofrecen el servicio "${q}" o no está disponible cerca de ti.`
            : "No hay partners disponibles en este momento."}
        </Text>
      </View>
    );
  };

  const filteredPartners = listPartners;

  return (
    <View style={styles.container}>
      {isFromNotification && !!serviceData.name && (
        <View style={styles.notificationServiceCard}>
          <Text style={styles.notificationServiceTitle}>Servicio seleccionado</Text>
          <View style={styles.notificationCardInside}>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>{serviceData.name}</Text>

              {!!serviceData.description && (
                <Text style={styles.serviceDescription}>
                  {serviceData.description}
                </Text>
              )}

              {!!serviceData.status && (
                <View style={styles.statusRow}>
                  <View style={styles.redDot} />
                  <Text style={styles.statusText}>{serviceData.status}</Text>
                </View>
              )}
            </View>
            <View style={styles.divider} />
            <Text style={styles.serviceFooter}>{serviceData.category}</Text>
          </View>
        </View>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.textOptionsForYou}>
          {isFromNotification
            ? "Opciones disponibles cerca de ti"
            : "Encontramos estas opciones para ti"
          }
        </Text>
      </View>
      <View style={styles.partnersContainer}>
        <FlatList
          data={filteredPartners}
          renderItem={renderPartners}
          keyExtractor={(item) => item.id.toString()}
          style={styles.flatList}
          ListEmptyComponent={renderEmptyComponent}
        />
      </View>
    </View>
  );
};

export default SelectService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  textOptionsForYou: {
    fontSize: 18,
    color: Colors.gray,
  },
  textContainer: {
    marginTop: 20,
    padding: 15,
    paddingBottom: 0,
  },
  partnersContainer: {
    marginTop: 30,
    paddingBottom: 120,
  },
  item2: {
    flexDirection: "row",
    backgroundColor: Colors.white,
  },
  item: {
    minHeight: 130,
    paddingLeft: 15,
    paddingTop: 15,
    shadowColor: Colors.gray,
    backgroundColor: Colors.white,
    marginBottom: 10,
    elevation: 5,
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
  leftSection: {
    marginRight: 20
  },
  imageItem: {
    height: 90,
    width: 90,
    borderRadius: 11,
  },
  RightSection: {
    flex: 1,
    padding: 10
  },
  itemDescription: {
    fontSize: 15,
    marginTop: 5,
    color: Colors.gray,
  },
  footer: {
    marginVertical: 10,
    marginHorizontal: 10
  },
  rating: {
    flexDirection: 'row'
  },
  notificationServiceCard: {
    paddingHorizontal: 15,
    marginTop: 15,
  },
  notificationServiceTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 10,
  },
  notificationCardInside: {
    backgroundColor: Colors.white,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  serviceContent: {
    marginBottom: 5,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 12,
    color: Colors.gray,
    lineHeight: 16,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D32F2F", // color that matches standard urgent/error
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginVertical: 10,
  },
  serviceFooter: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.black,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 22,
  }
});
