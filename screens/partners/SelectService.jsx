import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { Colors } from "../../styles/Colors";
import ApiFetcher from "../../modules/ApiFetcher";
import { useNavigation } from "@react-navigation/native";
import { AnimatedImage, LoaderScreen, TextField } from "react-native-ui-lib";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SelectService = ({ route }) => {
  const { type, serviceId, petId, q } = route.params || {};

  const [listPartners, setListPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [localQ, setLocalQ] = useState(q || "");
  const [searchInput, setSearchInput] = useState(q || "");
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeMode, setActiveMode] = useState(
    !!(type || serviceId || petId || q)
  );
  const [serviceData, setServiceData] = useState({
    name: q || "",
    description: "",
    status: "",
    category: q ? "Servicio sugerido" : "",
  });

  const apiFetcher = new ApiFetcher();
  const navigation = useNavigation();

  const hasParams =
    (type !== undefined && type !== null) ||
    (serviceId !== undefined && serviceId !== null) ||
    (petId !== undefined && petId !== null) ||
    (q !== undefined && q !== null && q !== "");

  const isFromNotification = !!q;

  // ─── Sincroniza params solo cuando cambian realmente ───────────────────────
  const prevParamsRef = useRef({
    q: undefined,
    vaccine_id: undefined,
    serviceId: undefined,
  });

  useEffect(() => {
    const newQ = route?.params?.q || "";
    const newVaccineId = route?.params?.vaccine_id;
    const newServiceId = route?.params?.serviceId;
    const prev = prevParamsRef.current;

    const paramsChanged =
      prev.q !== newQ ||
      prev.vaccine_id !== newVaccineId ||
      prev.serviceId !== newServiceId;

    if (paramsChanged) {
      prevParamsRef.current = {
        q: newQ,
        vaccine_id: newVaccineId,
        serviceId: newServiceId,
      };
      setLocalQ(newQ);
      setSearchInput(newQ);
      setListPartners([]);
      setActiveMode(!!newQ || !!newServiceId);

      if (newQ) {
        setServiceData({
          name: newQ,
          description: "",
          status: "",
          category: "Servicio sugerido",
        });
      } else {
        setServiceData({ name: "", description: "", status: "", category: "" });
      }
    }
  }, [route?.params?.q, route?.params?.vaccine_id, route?.params?.serviceId]);

  // ─── Permisos de ubicación ─────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      try {
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(loc.coords);
      } catch (error) {
        console.log("Error getting location:", error);
      }
    })();
  }, []);

  // ─── Categorías (solo en modo exploración) ─────────────────────────────────
  useEffect(() => {
    if (!hasParams && !activeMode) {
      apiFetcher
        .getServiceCategories()
        .then((res) => {
          if (res?.data) setCategories(res.data.slice(0, 6));
        })
        .catch((err) => console.log("Error categories:", err));
    }
  }, [hasParams, activeMode]);

  // ─── Carga de partners ─────────────────────────────────────────────────────
  useEffect(() => {
    fetchData();
  }, [localQ, location, activeCategoryId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { vaccine_id, catalog_code, service_catalog_id } = route?.params || {};

      const partners = await apiFetcher.getPartners({
        q: localQ || undefined,
        lat: location?.latitude,
        lng: location?.longitude,
        service_catalog_id,
        vaccine_id,
        catalog_code,
        category_id: activeCategoryId || undefined,
      });
      if (partners.code === 200 || partners.code === 201)
        setListPartners(partners.data);
    } catch (error) {
      console.log("Error: ", error);
      Alert.alert("Ha ocurrido un error", "Inténtelo de nuevo más tarde");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // ─── NUEVO: Limpia todo y regresa al modo exploración ──────────────────────
  const handleBack = () => {
    setActiveMode(false);
    setLocalQ("");
    setSearchInput("");
    setActiveCategoryId(null);
    setServiceData({ name: "", description: "", status: "", category: "" });
    setListPartners([]);
    navigation.setParams({
      type: undefined,
      serviceId: undefined,
      petId: undefined,
      q: undefined,
      vaccine_id: undefined,
      catalog_code: undefined,
      service_catalog_id: undefined,
    });
  };

  const goToMoreInfo = (item, type) => {
    const { vaccine_id, catalog_code, service_catalog_id } =
      route?.params || {};
    navigation.navigate("PartnersGeneralInfo", {
      id: item.id,
      type,
      petId,
      serviceId,
      q: localQ,
      vaccine_id,
      catalog_code,
      service_catalog_id,
    });
  };

  const handleSearch = () => {
    setLocalQ(searchInput);
    if (searchInput) setActiveMode(true);
  };

  const handlePillClick = (category) => {
    if (activeCategoryId === category.id) {
      setActiveCategoryId(null);
      setActiveMode(false);
    } else {
      setActiveCategoryId(category.id);
      setLocalQ("");
      setSearchInput("");
      setActiveMode(true);
      setServiceData({
        name: category.name,
        description: "",
        status: "",
        category: category.name,
      });
    }
  };

  const ExpandableText = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text
          numberOfLines={expanded ? undefined : 1}
          style={styles.itemDescription}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  // ─── Card de cada partner ─────────────────────────────────────────────────
  const renderPartners = ({ item }) => (
    <TouchableOpacity
      onPress={() => goToMoreInfo(item, item.type_partner?.id || 2)}
      style={styles.item}
    >
      <View style={styles.item2}>
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
          <ExpandableText text={item.description} />
          <View style={styles.rating}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Text key={i}>{i < item.rating ? "⭐" : "☆"}</Text>
            ))}
            <Text> {item.rating}</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text>📍 Circuito Misioneros 4-A, Naucalpan de Juá...</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => {
    if (loading) return <LoaderScreen color={Colors.primaryColor} />;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {localQ
            ? `Actualmente los partners no ofrecen el servicio "${localQ}" o no está disponible cerca de ti.`
            : "No hay partners disponibles en este momento."}
        </Text>
      </View>
    );
  };

  // ─── Header de la lista ───────────────────────────────────────────────────
  const headerComponent = (
    <View>
      {/* ── BOTÓN REGRESO: aparece cuando hay servicio activo por notificacion ── */}
      {hasParams && (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={Colors.black}
          />
          <Text style={styles.backButtonText}>Explorar servicios</Text>
        </TouchableOpacity>
      )}

      {/* ── HEADER DE EXPLORACIÓN: siempre visible si no viene de notificacion ── */}
      {!hasParams && (
        <View style={styles.searchHeaderContainer}>
          <View style={styles.greetingRow}>
            <View>
              <Text style={styles.greetingGuau}>¡Guau!</Text>
              <Text style={styles.greetingSub}>
                Me encanta verte por aquí.
              </Text>
            </View>
          </View>

          <View style={styles.searchBar}>
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color={Colors.gray}
              style={{ marginRight: 10 }}
            />
            <TextField
              placeholder="Explora, reserva y cuida de tu compañero."
              value={searchInput}
              onChangeText={setSearchInput}
              onSubmitEditing={handleSearch}
              hideUnderline
              style={{ flex: 1, fontSize: 14 }}
            />
            {!!searchInput && (
              <TouchableOpacity
                onPress={() => {
                  setSearchInput("");
                  setLocalQ("");
                  setActiveCategoryId(null);
                  setActiveMode(false);
                }}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={20}
                  color={Colors.gray}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.pillsContainer}>
            {categories.map((cat, index) => {
              const isSelected = activeCategoryId === cat.id;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.pill,
                    isSelected && { backgroundColor: Colors.primaryColor },
                  ]}
                  onPress={() => handlePillClick(cat)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      isSelected && { color: Colors.white },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* ── CARD DE SERVICIO DESDE NOTIFICACIÓN ── */}
      {isFromNotification && activeMode && !!serviceData.name && (
        <View style={styles.notificationServiceCard}>
          <Text style={styles.notificationServiceTitle}>
            Servicio seleccionado
          </Text>
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

      {/* ── TÍTULO DE SECCIÓN ── */}
      <View
        style={[
          styles.textContainer,
          !hasParams && {
            borderTopWidth: 1,
            borderTopColor: "#EAEAEA",
            paddingTop: 15,
          },
        ]}
      >
        <Text style={styles.textOptionsForYou}>
          {hasParams
            ? "Opciones disponibles cerca de ti"
            : (localQ || activeCategoryId)
              ? "Encontramos estas opciones para ti"
              : "Cerca de ti"}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={listPartners}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primaryColor]} />
        }
        renderItem={renderPartners}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flatList}
        contentContainerStyle={{ paddingBottom: 150 }}
        ListEmptyComponent={renderEmptyComponent}
        ListHeaderComponent={headerComponent}
      />
    </View>
  );
};

export default SelectService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  // ── NUEVO: estilos del botón de regreso ────────────────────────────────────
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    backgroundColor: Colors.white,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.black,
    marginLeft: 10,
    fontWeight: "500",
  },
  // ── Estilos existentes ─────────────────────────────────────────────────────
  textOptionsForYou: {
    fontSize: 18,
    color: Colors.gray,
  },
  textContainer: {
    marginTop: 20,
    padding: 15,
    paddingBottom: 0,
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
    marginRight: 20,
  },
  imageItem: {
    height: 90,
    width: 90,
    borderRadius: 11,
  },
  RightSection: {
    flex: 1,
    padding: 10,
  },
  itemDescription: {
    fontSize: 15,
    marginTop: 5,
    color: Colors.gray,
  },
  footer: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  rating: {
    flexDirection: "row",
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
    backgroundColor: "#D32F2F",
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
  },
  searchHeaderContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingGuau: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primaryColor,
  },
  greetingSub: {
    fontSize: 16,
    color: Colors.primaryColor,
  },
  searchBar: {
    marginTop: 20,
    backgroundColor: "#F2F2F2",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  pillsContainer: {
    marginTop: 15,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  pill: {
    backgroundColor: "#F2F7FA",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 10,
  },
  pillText: {
    fontSize: 14,
    color: "#1A2D3A",
  },
});