import React from 'react';
import { 
  Image, 
  View, 
  Text, 
  TouchableOpacity 
} from 'react-native-ui-lib';
import { ServiceListProps } from './types';

const ServiceList = (props: ServiceListProps) => {
  return (
    <View width={'100%'} center marginB-20>
      <TouchableOpacity onPress={props.onPress}>
        <Image
          source={props.imageSource}
          style={{ width: 375, height: 250 }}
          resizeMode="contain"
        />
        <View style={{ position: 'absolute', left: 40, top: 80 }}>
          <Text text50BO>{props.title}</Text> 
          {props.subtitle && (
            <View width={100}>
              <Text text14 marginT-10>{props.subtitle}</Text>
            </View>
          )}
          <View marginT-10 padding-5 width={80} height={40} bg-red30 center>
            <Text white text80M>Ver más</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ServiceList;
