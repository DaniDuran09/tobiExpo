import { TouchableOpacity } from "react-native";
import { View, Text, Image } from "react-native-ui-lib";

interface RenderItemProps {
  name: string;
  description: string;
  picture: string;
  url: string;
  navigation: any;
}

const RenderItem = ({
  name,
  description,
  picture,
  url,
  navigation,
}: RenderItemProps) => (
  <TouchableOpacity onPress={() => navigation.navigate("WebView", { url })}>
    <View bg-white marginB-10 paddingL-10 paddingR-10 center width="100%">
      <View width="100%" row>
        <View center>
          <Image
            source={{ uri: picture }}
            height={60}
            width={60}
            borderRadius={100}
          />
        </View>
        <View width="95%" marginV-20>
          <View width="80%" paddingT-10 marginL-15>
            <View paddingB-5>
              <Text text70BL>{name}</Text>
            </View>
            <Text text90T>{description}</Text>
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default RenderItem;
