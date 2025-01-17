import { View, Image } from "react-native-ui-lib";

export default function Header() {
  return (
    <View
      style={{
        height: "20%",
        width: "100%",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingLeft: 20,
      }}
    >
      <Image
        source={require("../../assets/Logo.png")}
        style={{ height: 70, width: 200 }}
        resizeMode={"contain"}
      />
    </View>
  );
}
