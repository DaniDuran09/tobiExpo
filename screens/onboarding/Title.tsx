import { Platform } from "react-native";
import { View, Text } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";

export default function Title({ text }: { text: string }) {
  return (
    <View style={{minHeight:120}}>
      <Text
        text40BO
        color={Colors.secondaryColor}
        style={{      
          fontFamily: Platform.OS === "android" ? "Poppins" : undefined,
        }}
      >
        {text}
      </Text>
    </View>
  );
}
