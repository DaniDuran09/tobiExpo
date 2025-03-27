import { TouchableOpacity, View } from "react-native-ui-lib";
import { Colors, gradientColors } from "../../../styles/Colors";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SectionProps, NavigationProp } from "./types";

const Section = ({ children, item, tabIndex }: SectionProps) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <LinearGradient
      colors={gradientColors}
      style={{
        height: 165,
        width: "45%",
        padding: 2,
        borderRadius: 10,
      }}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("HomeProfileDetails", {
            item,
            tabIndex,
          })
        }
      >
        <View
          backgroundColor={Colors.lightGray}
          height={"100%"}
          style={{ borderRadius: 10 }}
          padding-10
          spread
        >
          {children}
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Section;
