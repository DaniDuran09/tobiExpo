import { TouchableOpacity, View } from "react-native-ui-lib";
import { Colors, gradientColors } from "../../../styles/Colors";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SectionProps, NavigationProp } from "./types";

const Section = ({ children, item, tabIndex }: SectionProps) => {
  const navigation = useNavigation<NavigationProp>();
  const isGrayBackground = tabIndex === 3 || tabIndex === 4;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("HomeProfileDetails", {
          item,
          tabIndex,
        })
      }
      style={{
        width: "45%",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 8,
      }}
    >
      {isGrayBackground ? (
        <View
          style={{
            backgroundColor: Colors.lightGray,
            height: 165,
            borderRadius: 10,
            padding: 10,
            justifyContent: "space-between",
          }}
        >
          {children}
        </View>
      ) : (
        <LinearGradient
          colors={gradientColors}
          style={{
            height: 165,
            padding: 2,
            borderRadius: 10,
            justifyContent: "space-between",
          }}
        >
          <View
            backgroundColor={Colors.lightGray}
            height={"100%"}
            style={{
              borderRadius: 10,
              padding: 10,
              justifyContent: "space-between",
            }}
          >
            {children}
          </View>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

export default Section;
