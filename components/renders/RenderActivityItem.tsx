import { TouchableOpacity, Image, View, StyleSheet } from "react-native";
import { Text } from "react-native-ui-lib";
import { RootStackParamList } from "../user/BottonMenu/types"; 


interface ActivityItemProps {
  item: any;
  disabledOption?: boolean;
  screenNavigate: (screenName: keyof RootStackParamList) => void;
}

const renderActivityItem = ({
  item,
  disabledOption,
  screenNavigate,
}: ActivityItemProps) => (
  <TouchableOpacity
    disabled={disabledOption}
    onPress={() => screenNavigate(item.screen)}
    style={[styles.section, disabledOption && { opacity: 0.5 }]}
  >
    <Image
      source={item.imageSource}
      style={styles.image}
      resizeMode={"contain"}
    />
    <Text text70BO black style={styles.text}>
      {item.title}
    </Text>
    <Image
      source={require("../../assets/arrowRigth.png")}
      style={styles.arrowImage}
      resizeMode={"contain"}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  section: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  image: { height: 20, width: 20, marginRight: 10 },
  text: {
    flex: 1,
    fontWeight: "bold",
  },
  arrowImage: { height: 15, width: 15 },
});

export default renderActivityItem;
