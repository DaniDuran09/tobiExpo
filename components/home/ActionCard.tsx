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

const ctaLabel = (action: string): string => {
  switch (action) {
    case "view_appointment":
      return "Ver cita";
    case "book_consultation":
      return "Agendar cita";
    case "view_vaccines":
    case "view_deworming":
      return "Agendar";
    case "view_summary":
      return "Ver actualización";
    case "view_recommendation":
      return "Ver recomendación";
    case "edit_profile":
      return "Completar perfil";
    case "add_pet":
      return "Continuar registro";
    default:
      return "Continuar";
  }
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
      <View style={styles.avatarContainer}>
        {petPicture ? (
          <Avatar.Image source={{ uri: petPicture }} size={48} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name="paw" size={24} color="#999" />
          </View>
        )}
      </View>

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
        <Text style={styles.buttonText}>{ctaLabel(action)}</Text>
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
  avatarPlaceholder: {
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
    elevation: 1,
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
