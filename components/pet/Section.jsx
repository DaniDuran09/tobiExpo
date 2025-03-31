import { TouchableOpacity, View } from "react-native-ui-lib";
import { Colors, gradientColors } from "../../styles/Colors";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

const Section = ({ children, item, tabIndex }) => {
  const navigation = useNavigation();
  return (
    <View width={"45%"} height={165}>
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
    </View>
  );
};

export default Section;
