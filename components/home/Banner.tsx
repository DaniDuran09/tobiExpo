import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getThemeForCard, getIconForType } from "./ThemeMapping";

interface BannerProps {
  banner: any;
  onPress: (action: string, data: any, fingerprint?: string) => void;
  onClose?: () => void;
}

const Banner = ({ banner, onPress, onClose }: BannerProps) => {
  const { title, body, priority, type, action, data } = banner;
  const theme = getThemeForCard(banner);
  const iconName = getIconForType(type || action);

  const isNoShow = 
    (type || "").toLowerCase().includes("no_show") ||
    (action || "").toLowerCase().includes("no_show") ||
    (type || "").toLowerCase().includes("no_se_presento") ||
    (action || "").toLowerCase().includes("no_se_presento") ||
    banner.status === "no_show" ||
    data?.status === "no_show" ||
    data?.appointment_status === "no_show" ||
    (typeof title === "string" && (
      title.toLowerCase().includes("no se presentó") ||
      title.toLowerCase().includes("no se presento") ||
      title.toLowerCase().includes("no show")
    ));

  const petName = data?.pet_name || data?.pet?.name || data?.pet?.display_name || "";
  let displayTitle = title;
  let displayBody = body;

  if (isNoShow) {
    if (!displayTitle || displayTitle.trim().toLowerCase() === "no se presentó" || displayTitle.trim().toLowerCase() === "no se presento" || displayTitle.trim().toLowerCase() === "no_show") {
      displayTitle = petName ? `¿Quieres reagendar la cita de ${petName}?` : "¿Quieres reagendar la cita?";
    }
    if (!displayBody) {
      displayBody = "La consulta no pudo realizarse. Escríbenos y te ayudamos a encontrar un nuevo horario.";
    }
  }

  // The red badge logic (assuming critical/high priority gets a badge)
  const showBadge = priority === "critical" || priority === "high" || isNoShow || type?.includes("expired") || type?.includes("due");

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.fill, borderColor: theme.stroke }]}
      onPress={() => onPress(action, data, banner.entity_fingerprint)}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{displayTitle}</Text>
          {displayBody ? <Text style={styles.body}>{displayBody}</Text> : null}
        </View>

        <View style={styles.rightSection}>
          <View style={styles.iconCircle}>
            <Icon name={iconName} size={28} color={theme.cta} />
            {showBadge && (
              <View style={styles.redBadge}>
                <Text style={styles.redBadgeText}>!</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Botón de cerrar (X) absoluto arriba a la derecha */}
      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={18} color="#000" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    paddingRight: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    position: "relative",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    lineHeight: 20,
  },
  body: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
  },
  rightSection: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
  },
  redBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#EF4444",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  redBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
  }
});

export default Banner;
