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
  const { name, type_partner, picture, description, address } = item;

  return (
    <TouchableOpacity onPress={() => goToMoreInfo(item)}>
      <View
        padding-15
        bg-white
        row
        centerV
        spread
        marginB-10
        br10
        style={{
          shadowColor: Colors.gray,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
          elevation: 5,
        }}
      >
        <View width="65%">
          <Text text60BO>{name}</Text>
          <Text text80 marginT-5 color={Colors.gray}>
            {type_partner?.name}
          </Text>
          {description ? (
            <Text text90 marginT-5 color={Colors.gray} numberOfLines={2}>
              {description}
            </Text>
          ) : null}
          {address ? (
            <Text text90 marginT-5 color={Colors.primaryColor} numberOfLines={2}>
              {address}
            </Text>
          ) : null}
        </View>
        <View>
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
