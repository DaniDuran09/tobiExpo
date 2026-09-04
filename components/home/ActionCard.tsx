import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getThemeForCard } from "./ThemeMapping";
import { Avatar } from "react-native-paper";

interface ActionCardProps {
  card: any;
  onPress: (action: string, data: any, fingerprint?: string) => void;
  onClose?: () => void;
}

const ctaLabel = (action: string, type?: string, cardData?: any): string => {
  // En caso de que el backend empiece a mandar un cta_label explícito
  if (cardData && cardData.cta_label) return cardData.cta_label;
  if (cardData && cardData.button_text) return cardData.button_text;

  const str = (action || type || "").toLowerCase();
  
  if (str.includes("vaccine") || str.includes("deworming")) {
    return (str.includes("expired") || str.includes("due")) ? "Agendar" : "Ver detalles";
  }
  if (str.includes("appointment") || str.includes("booking") || str.includes("book")) {
    if (str.includes("book_consultation")) return "Agendar cita";
    return "Ver cita";
  }
  if (str.includes("weight")) {
    return "Ver detalles";
  }
  if (str.includes("summary") || str.includes("recommendation") || str.includes("clinical") || str.includes("visit")) {
    return "Ver actualización";
  }
  if (str.includes("pet") || str.includes("scheme") || str.includes("onboarding")) {
    if (str.includes("completed")) return "Ver detalles";
    if (str.includes("started")) return "Continuar";
    return "Completar perfil";
  }
  if (str.includes("follow_up")) {
    return "Agendar";
  }
  if (str.includes("multiple")) {
    return "Revisar tareas";
  }
  if (str.includes("user_inactive")) {
    return "Retomar camino";
  }
  return "Continuar";
};

const ActionCard = ({ card, onPress, onClose }: ActionCardProps) => {
  const { title, body, action, data } = card;
  const theme = getThemeForCard(card);
  const petPicture = data?.pet_picture_url || data?.pet?.picture || data?.pet_picture || null;

  return (
    <View style={[styles.container, { backgroundColor: theme.fill, borderColor: theme.stroke }]}>
      {/* Botón de cerrar (X) arriba a la derecha */}
      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="close" size={20} color="#000" />
        </TouchableOpacity>
      )}

      {/* Avatar arriba al centro */}
      {petPicture && petPicture !== "null" && petPicture !== "" ? (
        <View style={styles.avatarContainer}>
          <Avatar.Image source={{ uri: petPicture }} size={48} />
        </View>
      ) : null}

      {/* Título y descripción centrados */}
      <View style={styles.textContainer}>
        <Text style={styles.title} textAlign="center">{title}</Text>
        {body ? (
          <Text style={styles.body} textAlign="center">{body}</Text>
        ) : null}
      </View>

      {/* Botón de ancho completo */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.cta }]}
        onPress={() => onPress(action, data, card.id)}
      >
        <Text style={styles.buttonText}>{ctaLabel(action, card.type, card)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 16,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 10,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
    textAlign: "center",
  },
  body: {
    fontSize: 13,
    color: "#444",
    textAlign: "center",
    lineHeight: 18,
  },
  button: {
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  }
});

export default ActionCard;
