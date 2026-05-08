import { TouchableOpacity, View } from "react-native-ui-lib";
import { Colors, gradientColors } from "../../styles/Colors";
import { useNavigation } from "@react-navigation/native";

const Section = ({
  children,
  item = {},
  tabIndex,
  disabled = false,
  screen = "HomeProfileDetails",
  haveItem = false,
  onPress,
}) => {
  const navigation = useNavigation();
  return (
    <View width={"48%"} style={{ minHeight: 165 }}>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          if (screen == "Weight") {
            onPress();
            return;
          }
          navigation.navigate(screen, {
            idSelectedPet: item.id,
            tabIndex: tabIndex,
          });
        }}
        style={{
          opacity: 1,
          flex: 1,
        }}
      >
        <View
          backgroundColor={
            !haveItem && screen == "HomeProfileDetails"
              ? Colors.primaryColor
              : Colors.lightGray
          }
          style={[
            { borderRadius: 10, elevation: 5, flex: 1, minHeight: 165 },
            disabled && { opacity: 0.5 },
          ]}
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
