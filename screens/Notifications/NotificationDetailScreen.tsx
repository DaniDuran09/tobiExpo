import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";

export default function NotificationDetailScreen() {
  const { params } = useRoute<any>();
  return (
    <View flex bg-white centerH>
      <View
        width={60}
        height={60}
        backgroundColor={Colors.gray}
        br100
        marginT-20
      />
      {/* <Text center text60 marginT-20>
        {params?.title}
      </Text> */}
      <Text text70 marginT-10>
        {params?.body}
      </Text>
    </View>
  );
}
