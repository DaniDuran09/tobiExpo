import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedImage, Text, View } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import { Platform } from "react-native";

export default function NotificationDetailScreen() {
  const { params } = useRoute<any>();
  return (
    <View flex bg-white centerH>
      <View width={'100%'} height={170} /*paddingH-20*/ center row>
        <AnimatedImage source={{ uri: params?.image }}
          style={{ width: 120, height: 120, borderRadius: 100 }}
          marginT-20 />
      </View>
      {/* <Text center text60 marginT-20>
        {params?.title}
      </Text> */}
      <View width={'90%'} height={0.3} bg-black />
      <View flex padding-15>
        <Text text70BL marginT-10>
          {params?.title}
        </Text>
        <Text text70 marginT-10>
          {params?.body}
        </Text>
      </View>

    </View>
  );
}
