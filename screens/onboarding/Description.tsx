import { Platform } from "react-native";
import { View, Text } from "react-native-ui-lib";

export default function Description({text}:{text: string}) {
  return (
    <View width={"80%"} style={{paddingTop: "10%" }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "400",
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
