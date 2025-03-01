import { TouchableOpacity, Image, View } from "react-native-ui-lib";
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
  <View paddingV-10>
    <TouchableOpacity
      disabled={disabledOption}
      onPress={() => screenNavigate(item.screen)}
      style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          height={20}
          width={20}
          marginR-10
          source={item.imageSource}
          resizeMode={"contain"}
        />
        <Text text70BO black >
          {item.title}
        </Text>
      </View>
      
      <Image
        height={15}
        width={15}
        source={require("../../assets/arrowRigth.png")}
        resizeMode={"contain"}
        style={{ marginLeft: 'auto' }}
      />
    </TouchableOpacity>
  </View>
);

export default renderActivityItem;
