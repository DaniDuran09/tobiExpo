import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  RefreshControl,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import ApiFetcher from "../../modules/ApiFetcher";
import { Colors } from "../../styles/Colors";
import Icon from "react-native-vector-icons/Ionicons";
import { handleGlobalAction } from "../../utils/ActionHandler";

const apiFetcher = new ApiFetcher();

// ─── Helpers ────────────────────────────────────────────────────────────────

const getSectionKey = (card: any): "critical" | "upcoming" | "followup" => {
  const section = card.section;
  if (section === "atencion_requerida") return "critical";
  if (section === "proximos_cuidados") return "upcoming";
  if (section === "seguimiento") return "followup";

  const type = (card.type || "").toLowerCase();
  const action = (card.action || "").toLowerCase();
  const title = (card.title || "").toLowerCase();
  if (
    type.includes("no_show") ||
    type.includes("no_se_presento") ||
    action.includes("no_show") ||
    action.includes("no_se_presento") ||
    card.status === "no_show" ||
    card.data?.status === "no_show" ||
    card.data?.appointment_status === "no_show" ||
    title.includes("no se presentó") ||
    title.includes("no se presento") ||
    title.includes("reagendar")
  ) {
    return "critical";
  }

  const priority = card.priority ?? "";
  const colorLevel = card.color_level ?? "";
  if (priority === "critical" || colorLevel === "red") return "critical";
  if (priority === "high" || priority === "medium" || colorLevel === "yellow") return "upcoming";
  return "followup";
};

const SECTIONS = {
  critical: {
    label: "Atención requerida",
    color: "#EF4444",
    bg: "#FFF2F2",
    icon: "warning",
  },
  upcoming: {
    label: "Próximos cuidados",
    color: "#FBBF24", // Yellow color from design
    bg: "#FFFBEB",
    icon: "time-outline",
  },
  followup: {
    label: "Seguimiento",
    color: "#3B82F6",
    bg: "#EFF6FF",
    icon: "heart-outline",
  },
};

const ctaLabel = (action: string, type: string = "", card?: any): string => {
  const rawLabel = card?.cta_label || card?.button_text || card?.data?.cta_label || card?.data?.button_text;
  if (rawLabel) {
    if (rawLabel.trim().toLowerCase() === "continuar esquema" || rawLabel.trim().toLowerCase().includes("continuar esquema")) {
      return "Completar esquema";
    }
    return rawLabel;
  }

  const str = (action || type || "").toLowerCase();

  const is004 =
    str.includes("004") ||
    card?.trigger === "004" ||
    card?.trigger_id === "004" ||
    card?.trigger_id === 4 ||
    card?.data?.trigger === "004" ||
    card?.data?.trigger_id === "004" ||
    card?.data?.trigger_id === 4 ||
    card?.communication === "004" ||
    card?.communication_id === "004" ||
    card?.communication_id === 4 ||
    card?.data?.communication === "004" ||
    card?.data?.communication_id === "004" ||
    card?.data?.communication_id === 4 ||
    (typeof card?.title === "string" && card.title.toLowerCase().includes("perfil creado")) ||
    (typeof card?.body === "string" && card.body.toLowerCase().includes("completemos su esquema"));

  if (is004) {
    return "Completar esquema";
  }

  if (
    str.includes("no_show") ||
    str.includes("no_se_presento") ||
    str.includes("no se presentó") ||
    str.includes("no se presento") ||
    str.includes("reagendar") ||
    card?.status === "no_show" ||
    card?.data?.status === "no_show" ||
    card?.data?.appointment_status === "no_show"
  ) {
    return "Hablar con equipo de Tobi";
  }

  if (str.includes("scheme") || str.includes("esquema")) {
    return (str.includes("completed") || type === "scheme_completed" || action === "scheme_completed")
      ? "Ver detalles"
      : "Completar esquema";
  }

  if (type.startsWith("scheme_")) return type === "scheme_completed" ? "Ver detalles" : "Completar esquema";
  switch (action) {
    case "no_show":
    case "appointment_no_show":
    case "no_se_presento":
    case "reagendar":
    case "contact_tobi":
    case "whatsapp":
      return "Hablar con equipo de Tobi";
    case "view_appointment":
      return "Ver cita";
    case "book_consultation":
      return "Reservar ahora";
    case "view_vaccines":
    case "view_deworming":
      return (type.includes("expired") || type.includes("due")) ? "Agendar" : "Ver detalles";
    case "view_summary":
      return "Ver resumen";
    case "view_recommendation":
      return "Ver recomendación";
    case "edit_profile":
      return "Completar perfil";
    case "add_pet":
      return "Agregar mascota";
    case "complete_scheme":
    case "scheme_incomplete":
    case "scheme_started":
      return "Completar esquema";
    default:
      return "Continuar";
  }
};

const handleNavAction = async (action: string, data: any, fingerprint: string | undefined, type?: string, source?: string) => {
  await handleGlobalAction(action, data, fingerprint, type, source);
};

// ─── Sub-componentes ─────────────────────────────────────────────────────────

const CareCard = ({ card, sectionKey, onAction }: any) => {
  const section = SECTIONS[sectionKey as keyof typeof SECTIONS];
  const petPicture = card.data?.pet_picture_url || card.data?.pet?.picture || card.data?.pet_picture || null;
  const petName = card.data?.pet_name ?? card.data?.pet?.name ?? card.data?.pet?.display_name ?? "";
  
  const isNoShow = 
    (card.type || "").toLowerCase().includes("no_show") ||
    (card.action || "").toLowerCase().includes("no_show") ||
    (card.type || "").toLowerCase().includes("no_se_presento") ||
    (card.action || "").toLowerCase().includes("no_se_presento") ||
    card.status === "no_show" ||
    card.data?.status === "no_show" ||
    card.data?.appointment_status === "no_show" ||
    (typeof card.title === "string" && (
      card.title.toLowerCase().includes("no se presentó") ||
      card.title.toLowerCase().includes("no se presento") ||
      card.title.toLowerCase().includes("no show")
    ));

  // Clean emoji from title if any, as we use specific icons
  let titleText = card.title?.replace(/^[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]\s*/g, '') || card.title;
  let bodyText = card.body;

  if (isNoShow) {
    if (!titleText || titleText.trim().toLowerCase() === "no se presentó" || titleText.trim().toLowerCase() === "no se presento" || titleText.trim().toLowerCase() === "no_show") {
      titleText = petName ? `¿Quieres reagendar la cita de ${petName}?` : "¿Quieres reagendar la cita?";
    }
    if (!bodyText) {
      bodyText = "La consulta no pudo realizarse. Escríbenos y te ayudamos a encontrar un nuevo horario.";
    }
  }

  return (
    <View style={[styles.card, { backgroundColor: section.bg }]}>
      <View style={styles.cardRow}>
        {petPicture && petPicture !== "null" && petPicture !== "" ? (
          <View style={styles.avatarCol}>
            <Avatar.Image source={{ uri: petPicture }} size={44} />
          </View>
        ) : null}
        
        <View style={styles.contentCol}>
          <View style={styles.cardTitleRow}>
            <Icon name={section.icon} size={18} color={section.color} style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>{titleText}</Text>
          </View>
          {petName ? <Text style={styles.petName}>{petName}</Text> : null}
          {bodyText ? <Text style={styles.cardBody}>{bodyText}</Text> : null}
          
          <View style={styles.btnRow}>
            <TouchableOpacity 
              style={[styles.cardBtn, { backgroundColor: section.color }]} 
              onPress={onAction}
            >
              <Text style={styles.cardBtnText}>{ctaLabel(card.action, card.type, card)}</Text>
              <Icon name="chevron-forward" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

// ─── Pantalla principal ──────────────────────────────────────────────────────

const PendingCareScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  // Detecta si está montado como "CareCenter" (tab Health) o "PendingCare" (HomeStack)
  const source: string = route.name === "CareCenter" ? "CareCenter" : "Home";
  const [allCards, setAllCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const hideTooltip = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowTooltip(false);
    });
  }, [fadeAnim]);

  const handleHelpPress = useCallback(() => {
    if (showTooltip) {
      hideTooltip();
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setShowTooltip(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Auto-cierre temporal tras 5 segundos
    timerRef.current = setTimeout(() => {
      hideTooltip();
    }, 5000);
  }, [showTooltip, fadeAnim, hideTooltip]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const fetchCards = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await apiFetcher.getPendingCards();
      console.log("CARE CENTER CARDS RECIBIDAS:", JSON.stringify(response?.data?.cards, null, 2));
      const backendCards = response?.data?.cards ?? [];
      const filteredCards = backendCards.filter(
        (c: any) => c.action !== "scheme_started" && c.type !== "scheme_started"
      );

      // Check if backend already included a card for no_show
      const hasNoShowCard = filteredCards.some((c: any) => {
        const type = (c.type || "").toLowerCase();
        const action = (c.action || "").toLowerCase();
        const title = (c.title || "").toLowerCase();
        return (
          type.includes("no_show") ||
          type.includes("no_se_presento") ||
          action.includes("no_show") ||
          action.includes("no_se_presento") ||
          c.status === "no_show" ||
          c.data?.status === "no_show" ||
          c.data?.appointment_status === "no_show" ||
          title.includes("no se presentó") ||
          title.includes("no se presento")
        );
      });

      let extraCards: any[] = [];
      if (!hasNoShowCard) {
        try {
          const apptResponse = await apiFetcher.getAppointments({ status: "past", per_page: 10 });
          if (apptResponse?.status && apptResponse?.data?.appointments) {
            const pastAppts = apptResponse.data.appointments;

            // Fetch upcoming appointments to verify if a new appointment exists
            const upcomingResponse = await apiFetcher.getAppointments({ status: "pending", per_page: 20 });
            const upcomingAppts = upcomingResponse?.status ? (upcomingResponse.data?.appointments || []) : [];

            for (const appt of pastAppts) {
              const apptStatus = appt.appointment_status || (appt as any).status;
              if (apptStatus === "no_show") {
                const aps = appt.appointment_pet_services?.[0];
                const petId = aps?.pet?.id;
                const petName = aps?.pet?.display_name || aps?.pet?.name || "";
                const petPic = aps?.pet?.picture || null;

                // "El estado debe permanecer visible mientras no exista una nueva cita."
                const hasNewAppointment = upcomingAppts.some((u: any) => {
                  const uPetId = u.appointment_pet_services?.[0]?.pet?.id;
                  const uStatus = u.appointment_status || (u as any).status;
                  const isActive = ["scheduled", "pending", "confirmed", "in_queue", "in_progress", "actived"].includes(uStatus);
                  return isActive && (!petId || uPetId === petId);
                });

                if (!hasNewAppointment) {
                  extraCards.push({
                    id: `no_show_${appt.id}`,
                    title: petName ? `¿Quieres reagendar la cita de ${petName}?` : "¿Quieres reagendar la cita?",
                    body: "La consulta no pudo realizarse. Escríbenos y te ayudamos a encontrar un nuevo horario.",
                    action: "no_show",
                    type: "no_show",
                    section: "atencion_requerida",
                    priority: "critical",
                    color_level: "red",
                    cta_label: "Hablar con equipo de Tobi",
                    data: {
                      appointment_id: appt.id,
                      pet_id: petId,
                      pet_name: petName,
                      pet_picture_url: petPic,
                      date: appt.date_service,
                    },
                  });
                }
              }
            }
          }
        } catch (e) {
          console.log("Error checking past appointments for Care Center no_show:", e);
        }
      }

      setAllCards([...extraCards, ...filteredCards]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchCards(); }, []));

  const grouped: Record<string, any[]> = { critical: [], upcoming: [], followup: [] };
  allCards.forEach((card) => grouped[getSectionKey(card)].push(card));

  const countCrit = grouped.critical.length;
  const countUpc = grouped.upcoming.length;
  const countFol = grouped.followup.length;

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <ActivityIndicator size="large" color={Colors.primaryColor} style={{marginTop: 50}} />
      </SafeAreaView>
    );
  }



  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        onScrollBeginDrag={hideTooltip}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchCards(true)} />}
      >
        {/* Header personalizado */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>

            <View>
              <Text style={styles.headerTitle}>Care Center</Text>
              <Text style={styles.headerSubtitle}>Revisa y da seguimiento a su salud</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleHelpPress}
            accessibilityRole="button"
            accessibilityLabel="Ayuda de Care Center"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon
              name="help-circle-outline"
              size={28}
              color={showTooltip ? Colors.primaryColor : "#666"}
            />
          </TouchableOpacity>
        </View>

        {/* Resumen Box */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Resumen</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCol}>
              <Icon name="warning" size={24} color="#EF4444" />
              <View style={styles.summaryTexts}>
                <Text style={styles.summaryCount}>{countCrit}</Text>
                <Text style={styles.summaryLabel}>Atención{"\n"}requerida</Text>
              </View>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryCol}>
              <Icon name="time-outline" size={24} color="#FBBF24" />
              <View style={styles.summaryTexts}>
                <Text style={styles.summaryCount}>{countUpc}</Text>
                <Text style={styles.summaryLabel}>Próximos{"\n"}cuidados</Text>
              </View>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryCol}>
              <Icon name="heart-outline" size={24} color="#3B82F6" />
              <View style={styles.summaryTexts}>
                <Text style={styles.summaryCount}>{countFol}</Text>
                <Text style={styles.summaryLabel}>Seguimiento{"\n"}pendiente</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Secciones */}
        {(["critical", "upcoming", "followup"] as const).map((key) => {
          if (grouped[key].length === 0) return null;
          const section = SECTIONS[key];
          return (
            <View key={key} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: section.color }]}>
                {section.label}
              </Text>
              {grouped[key].map((card, idx) => (
                <CareCard
                  key={idx}
                  card={card}
                  sectionKey={key}
                  onAction={() => handleNavAction(card.action, card.data, card.id, card.type, source)}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>

      {/* Tooltip flotante temporal encima de todo */}
      {showTooltip && (
        <Animated.View
          style={[styles.tooltipContainer, { opacity: fadeAnim }]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={hideTooltip}
            style={styles.tooltipCard}
          >
            <View style={styles.tooltipArrowBorder} />
            <View style={styles.tooltipArrow} />
            <Text style={styles.tooltipText}>
              Aquí encontrarás los cuidados pendientes, las próximas recomendaciones y el seguimiento de la salud de tus mascotas para saber qué necesitan y cuándo es momento de actuar.
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { paddingBottom: 40 },
  
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backBtn: {
    marginRight: 4,
    padding: 2,
  },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#111" },
  headerSubtitle: { fontSize: 14, color: "#666", marginTop: 4 },

  // Summary Box
  summaryBox: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 24,
  },
  summaryTitle: { fontSize: 15, fontWeight: "700", color: "#111", marginBottom: 12 },
  summaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  summaryCol: { flexDirection: "row", alignItems: "center", flex: 1, gap: 8 },
  summaryTexts: { flex: 1 },
  summaryCount: { fontSize: 16, fontWeight: "800", color: "#111" },
  summaryLabel: { fontSize: 11, color: "#666", lineHeight: 14 },
  summaryDivider: { width: 1, height: 30, backgroundColor: "#E5E7EB", marginHorizontal: 10 },

  // Sections
  section: { marginHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },

  // Card
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardRow: { flexDirection: "row" },
  avatarCol: { marginRight: 12 },
  contentCol: { flex: 1 },
  cardTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  petName: { fontSize: 14, color: "#444", marginBottom: 2 },
  cardBody: { fontSize: 13, color: "#666", lineHeight: 18, marginBottom: 12 },
  btnRow: { flexDirection: "row" },
  cardBtn: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, gap: 4
  },
  cardBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  // Tooltip temporal flotante
  tooltipContainer: {
    position: "absolute",
    top: 78,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 10,
  },
  tooltipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  tooltipArrowBorder: {
    position: "absolute",
    top: -9,
    right: 17,
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 9,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#E5E7EB",
  },
  tooltipArrow: {
    position: "absolute",
    top: -8,
    right: 18,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#FFFFFF",
  },
  tooltipText: {
    fontSize: 13.5,
    color: "#4B5563",
    lineHeight: 20,
    fontWeight: "400",
  },
});

export default PendingCareScreen;
