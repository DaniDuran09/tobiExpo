import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native-ui-lib';
import { AnimatedImage, LoaderScreen } from 'react-native-ui-lib';
import { Colors } from '../../styles/Colors';

const RenderPartners = ({ item, goToMoreInfo }: { item: Partner; goToMoreInfo: (item: Partner) => void }) => (
  <TouchableOpacity onPress={() => goToMoreInfo(item)}>
    <View
      height={130}
      padding-15
      backgroundColor={Colors.white}
      row
      centerV
      spread
      style={{
        marginBottom: 10,
        shadowColor: Colors.gray,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
        borderRadius: 8, 
      }}
    >
      <View width="50%">
        <Text style={{ fontSize: 22, fontWeight: '600' }}>{item.name}</Text>
        <Text style={{ fontSize: 15, marginTop: 5, color: Colors.gray }}>{item.type_partner.name}</Text>
      </View>
      <View paddingR-15>
        <AnimatedImage
          source={{ uri: item.picture || '' }} 
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

export default RenderPartners;
