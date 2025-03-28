import { Image } from "react-native";
export default function Header() {
  return (

    <Image
      source={require("../../../assets/Logo.png")}
      style={{ height: 70, width: 200, marginBottom:80 }}
      resizeMode={"contain"}
    />

  );
}
