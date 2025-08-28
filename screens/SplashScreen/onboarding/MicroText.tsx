import { Platform } from "react-native";
import { View, Text } from "react-native-ui-lib";
import { Colors } from "../../../styles/Colors";

export default function MicroText({text}:{text: string}) {
  return (
    <View marginT-20>
      <Text
        color={Colors.white}
        text70L
        style={{                      
          fontFamily: Platform.OS === "android" ? "Poppins" : undefined,
        }}
      >
        {text}
      </Text>
    </View>
  );
}
