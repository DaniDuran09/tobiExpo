import { Image, Text, View } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";

export const CardInfo = ({ title, image, children }) => {
  return (
    <View padding-15 br40 backgroundColor={Colors.mediumWhite} marginB-15>
      <View row centerV gap-10>
        <Image source={image} width={20} height={20} />
        <Text text65M>{title}</Text>
      </View>
      {children}
    </View>
  );
};
