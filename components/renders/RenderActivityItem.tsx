import { TouchableOpacity, Image, View } from "react-native-ui-lib";
import { Text } from "react-native-ui-lib";

interface ActivityItemProps {
  imageSource: any;
  title: string;
  screen: string;
  disabledOption?: boolean;
  screenNavigate: (screenName: string) => void;
}

const RenderActivityItem = ({
  imageSource,
  title,
  screen,
  disabledOption,
  screenNavigate,
}: ActivityItemProps) => (
  <View paddingV-10>
    <TouchableOpacity
      disabled={disabledOption}
      onPress={() => screenNavigate(screen)}
      style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          height={20}
          width={20}
          marginR-10
          source={imageSource}
          resizeMode={"contain"}
        />
        <Text text70BO black>
          {title}
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

export default RenderActivityItem;
