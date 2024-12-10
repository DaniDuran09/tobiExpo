import {
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { AnimatedImage, LoaderScreen, View, Text } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";
import { ImageSourceType } from "react-native-ui-lib/src/components/image";

type Props = {
  style: ViewStyle;
  pictureContainerStyle: StyleProp<ImageStyle>;
  picture: ImageSourceType;
  name: string;
  color: any;
  onPress: VoidFunction;
};

export function UserItem({
  style,
  pictureContainerStyle,
  picture,
  name,
  color,
  onPress,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View center marginR-25 style={style}>
        <AnimatedImage
          source={picture}
          style={pictureContainerStyle}
          loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
          animationDuration={500}
          resizeMode="cover"
          width={70}
          height={70}
          borderRadius={64}
        />
        <Text color={color} text70R>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
