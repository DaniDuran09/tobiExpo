import { TouchableOpacity, View } from "react-native-ui-lib";
import { Colors, gradientColors } from "../../styles/Colors";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

const Section = ({ children, item = {}, tabIndex, disabled = false }) => {
  const navigation = useNavigation();
  return (
    <View width={"45%"} height={165}>
      <TouchableOpacity
        disabled={disabled}
        onPress={() =>
          navigation.navigate("HomeProfileDetails", {
            idSelectedPet: item.id,
          })
        }
        style={{
          opacity: disabled ? 0.3 : 1,
        }}
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
