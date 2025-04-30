import { View, Text, TouchableOpacity } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import momentTZ from "../../utils/moment";

interface RenderNotificationProps {
  content: string | null;
  date: string;
  onPress: () => void;
  readed: boolean
}

export default function RenderNotification({
  content,
  date,
  onPress,
  readed = false
}: RenderNotificationProps) {

  const displayDate = (notificationDate: string) => {
    const date = momentTZ(notificationDate)
    const now = momentTZ()
    if (now.diff(date, "minutes") < 1) {
      return "Ahora"
    }
    return momentTZ(date).format("DD/MM")
  }
  return (
    <TouchableOpacity
      paddingH-10
      onPress={onPress}
      row
      centerV
    >
      <View height={40} width={40} br100 marginR-8 backgroundColor={Colors.gray} />
      <View flex row paddingV-14 style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.5 }}>
        <Text flex text70 marginR-4 style={{ fontWeight: readed ? "normal" : "bold" }}>{content}</Text>
        <Text style={{ alignSelf: "flex-start", fontWeight: readed ? "normal" : "bold" }}>{displayDate(date)}</Text>
      </View>

    </TouchableOpacity>
  );
}
