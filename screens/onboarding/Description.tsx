import { Platform } from "react-native";
import { View, Text } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";

export default function Description({text}:{text: string}) {
  return (
    <View>
      <Text
        color={Colors.white}
        text50R
        style={{                      
          fontFamily: Platform.OS === "android" ? "Poppins" : undefined,
        }}
      >
        {text}
      </Text>
    </View>
  );
}
