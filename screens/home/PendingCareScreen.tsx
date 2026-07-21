import React, { useCallback, useState } from "react";
import {
  RefreshControl,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-paper";
import ApiFetcher from "../../modules/ApiFetcher";
import { Colors } from "../../styles/Colors";
import Icon from "react-native-vector-icons/Ionicons";
import { handleGlobalAction } from "../../utils/ActionHandler";

const apiFetcher = new ApiFetcher();

// ─── Helpers ────────────────────────────────────────────────────────────────

const getSectionKey = (card: any): "critical" | "upcoming" | "followup" => {
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

const ctaLabel = (action: string): string => {
  switch (action) {
    case "view_appointment":
      return "Ver cita";
    case "book_consultation":
      return "Reservar ahora";
    case "view_vaccines":
    case "view_deworming":
      return "Agendar";
    case "view_summary":
      return "Ver resumen";
    case "view_recommendation":
      return "Ver recomendación";
    case "edit_profile":
      return "Completar perfil";
    case "add_pet":
      return "Agregar mascota";
    default:
      return "Continuar";
  }
};

const handleNavAction = async (action: string, data: any, fingerprint: string | undefined) => {
  await handleGlobalAction(action, data, fingerprint);
};

// ─── Sub-componentes ─────────────────────────────────────────────────────────

const CareCard = ({ card, sectionKey, onAction }: any) => {
  const section = SECTIONS[sectionKey as keyof typeof SECTIONS];
  const petPicture = card.data?.pet_picture_url || card.data?.pet?.picture || card.data?.pet_picture || null;
  const petName = card.data?.pet_name ?? "";
  
  // Clean emoji from title if any, as we use specific icons
  const titleText = card.title?.replace(/^[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]\s*/g, '') || card.title;

  return (
    <View style={[styles.card, { backgroundColor: section.bg }]}>
      <View style={styles.cardRow}>
        <View style={styles.avatarCol}>
          {petPicture ? (
            <Avatar.Image source={{ uri: petPicture }} size={44} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="paw" size={24} color="#999" />
            </View>
          )}
        </View>
        
        <View style={styles.contentCol}>
          <View style={styles.cardTitleRow}>
            <Icon name={section.icon} size={18} color={section.color} style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>{titleText}</Text>
          </View>
          {petName ? <Text style={styles.petName}>{petName}</Text> : null}
          {card.body ? <Text style={styles.cardBody}>{card.body}</Text> : null}
          
          <View style={styles.btnRow}>
            <TouchableOpacity 
              style={[styles.cardBtn, { backgroundColor: section.color }]} 
              onPress={onAction}
            >
              <Text style={styles.cardBtnText}>{ctaLabel(card.action)}</Text>
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
  const [allCards, setAllCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCards = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await apiFetcher.getPendingCards();
      setAllCards(response?.data?.cards ?? []);
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
          <TouchableOpacity>
            <Icon name="help-circle-outline" size={28} color="#666" />
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
                  onAction={() => handleNavAction(card.action, card.data, card.id)}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>
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
  avatarPlaceholder: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: "#E5E7EB",
    justifyContent: "center", alignItems: "center"
  },
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
});

export default PendingCareScreen;
