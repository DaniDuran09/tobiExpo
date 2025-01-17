import { Platform } from "react-native";
import { View, Text } from "react-native-ui-lib";

export default function Title({ text }: { text: string }) {
  return (
    <View width={"80%"}>
      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          textAlign: "left",
          color: "#E6F8DB",
          fontFamily: Platform.OS === "android" ? "Poppins" : undefined,
        }}
      >
        {text}
      </Text>
    </View>
  );
}
