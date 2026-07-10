import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getThemeForCard, getIconForType } from "./ThemeMapping";
import { Avatar } from "react-native-paper";

interface ActionCardProps {
  card: any;
  onPress: (action: string, data: any) => void;
}

const ActionCard = ({ card, onPress }: ActionCardProps) => {
  const { title, body, priority, type, action, data } = card;
  const theme = getThemeForCard(priority, type);
  const iconName = getIconForType(type);
  const petPicture = data?.pet_picture_url || null;

  return (
    <View style={[styles.container, { backgroundColor: theme.fill, borderColor: theme.stroke }]}>
      <View style={styles.header}>
        {petPicture ? (
          <Avatar.Image source={{ uri: petPicture }} size={40} style={styles.avatar} />
        ) : (
          <View style={styles.iconContainer}>
            <Icon name={iconName} size={24} color="#333" />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.cta }]} 
        onPress={() => onPress(action, data)}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
    color: "#333",
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: "#666",
  },
  button: {
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  }
});

export default ActionCard;
