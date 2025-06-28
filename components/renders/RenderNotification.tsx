import { View, Text, TouchableOpacity, AnimatedImage } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import momentTZ from "../../utils/moment";

interface RenderNotificationProps {
  content: string | null;
  date: number;
  onPress: () => void;
  readed: boolean;
  image:string;
  body:string | null;
}

export default function RenderNotification({
  content,
  date,
  onPress,
  readed = false,
  image,
  body,
}: RenderNotificationProps) {
  const displayDate = (notificationDate: number) => {
    const date = momentTZ(notificationDate);
    const now = momentTZ();
    if (now.diff(date, "minutes") < 1) {
      return "Ahora";
    }
    return momentTZ(date).format("DD/MM");
  };
  return (
    <TouchableOpacity paddingH-10 onPress={onPress} row centerV>
      <AnimatedImage marginR-8  source={{ uri: image }} style={{width:40,height:40,borderRadius:100}}/>
      <View
        flex
        row
        paddingV-20
        style={{ borderBottomColor: Colors.gray, borderBottomWidth: 0.2 }}
      >
        <Text
          flex
          text70
          marginR-4
          style={{ fontWeight: readed ? "normal" : "bold" }}
        >
          {content}
        </Text>
        <Text
          style={{
            alignSelf: "flex-start",
            fontWeight: readed ? "normal" : "bold",
          }}
        >
          {displayDate(date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
