import { View, Text, TouchableOpacity, AnimatedImage, Colors, Button } from "react-native-ui-lib";
import momentTZ from "../../utils/moment";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { StyleSheet } from "react-native";

interface RenderNotificationProps {
  id: number;
  content: string | null;
  date: string | number;
  onPress: () => void;
  readed: boolean;
  image: string | null;
  body: string | null;
  status?: string | null;
  category?: string | null;
}

export default function RenderNotification({
  id,
  content,
  date,
  onPress,
  readed = false,
  image,
  body,
  status,
  category,
}: RenderNotificationProps) {

  const displayDate = (notificationDate: string | number) => {
    return momentTZ(notificationDate).format("DD/MM");
  };
  const getCategoryInfo = () => {
    if (category === "POR VENCER") {
      return { label: "POR VENCER", color: "#FF9F43" };
    }
    if (category === "URGENTE") {
      return { label: "URGENTE", color: "#EF3E36" };
    }
    if (category === "RECORDATORIO") {
      return { label: "RECORDATORIO", color: "#9E9E9E" };
    }

    const title = content?.toLowerCase() || "";
    if (title.includes("semana") || title.includes("próxima") || title.includes("vencer")) {
      return { label: "POR VENCER", color: "#FF9F43" };
    }
    if (title.includes("hoy") || title.includes("urgente") || title.includes("ahora")) {
      return { label: "URGENTE", color: "#EF3E36" };
    }
    console.log("title", title);
    return { label: "RECORDATORIO", color: "#9E9E9E" };
  };

  const { label, color } = getCategoryInfo();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.container, !readed && styles.unreadBackground]}
    >
      <View row spread centerV marginB-8>
        <View paddingH-8 paddingV-2 style={{ backgroundColor: color, borderRadius: 4 }}>
          <Text white text100BO style={{ fontSize: 10, letterSpacing: 0.5 }}>{label}</Text>
        </View>
        <Text text90 gray style={{ fontSize: 11 }}>{displayDate(date)}</Text>
      </View>

      <View row spread>
        <View flex-1>
          <View row centerV marginB-4>
            <Icon name="clock-outline" size={14} color={color} style={{ marginRight: 4 }} />
            <Text text70BO black>{content}</Text>
          </View>

          <Text text80 gray marginB-12 numberOfLines={3}>
            {body}
          </Text>

          {/* Optional Pet Info / Reservar Button */}
          <View row centerV spread>
            <View row centerV>
              {image ? (
                <AnimatedImage source={{ uri: image }} style={styles.petImage} />
              ) : (
                <View style={styles.petImagePlaceholder}>
                  <Icon name="paw" size={12} color="#9E9E9E" />
                </View>
              )}
            </View>

            {/*label !== "RECORDATORIO" ? (
              <Button
                label="Reservar ahora"
                size={Button.sizes.xSmall}
                backgroundColor={color}
                outline={false}
                br10
                paddingH-12
                style={{ height: 24 }}
              />
            ) : null*/}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: 'white',
  },
  unreadBackground: {
    backgroundColor: '#FFF9F9',
  },
  petImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  petImagePlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
