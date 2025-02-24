import React from "react";
import { TouchableOpacity, View, Text } from "react-native-ui-lib";
import { AnimatedImage, LoaderScreen } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";

const RenderPartners = ({
  item,
  goToMoreInfo,
}: {
  item: Partner;
  goToMoreInfo: (item: Partner) => void;
}) => {
  const { name, type_partner, picture } = item; 

  return (
    <TouchableOpacity onPress={() => goToMoreInfo(item)}>
      <View
        height={120}
        padding-15
        bg-white
        row
        centerV
        spread
        marginB-10
        br10
        style={{
          elevation: 5,
        }}
      >
        <View width="50%">
          <Text text60BO>{name}</Text>
          <Text text80 marginT-5 color={Colors.gray}>
            {type_partner.name} 
          </Text>
        </View>
        <View paddingR-10>
          <AnimatedImage
            source={{ uri: picture || "" }}
            height={90}
            width={90}
            borderRadius={11}
            loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
            animationDuration={500}
            resizeMode="contain"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RenderPartners;
