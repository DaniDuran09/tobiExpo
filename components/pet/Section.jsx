import { TouchableOpacity, View } from "react-native-ui-lib";
import { Colors, gradientColors } from "../../styles/Colors";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

const Section = ({ children, item, tabIndex }) => {
  const navigation = useNavigation();
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
            tabIndex: tabIndex,
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
