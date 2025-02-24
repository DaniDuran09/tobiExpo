import React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native-ui-lib";
import { ServiceListProps } from "./types";
import { Colors } from "../../../styles/Colors";

const ServiceList = ({title, onPress, imageSource, subtitle}: ServiceListProps) => {
  return (
    <View width={"100%"} center marginB-5>
      <TouchableOpacity onPress={onPress}>
        <Image
          source={imageSource}
          width={375}
          height={250}
          resizeMode="contain"
        />
        <View absF style={{ top: 80, left: 40 }}>
          <Text text50BO>{title}</Text>
          {subtitle && (
            <View width={100}>
              <Text text14 marginT-10>
                {subtitle}
              </Text>
            </View>
          )}
          <View
            marginT-15
            padding-5
            width={80}
            height={40}
            backgroundColor={Colors.primaryColor}
            center
            br20
          >
            <Text white text80M>
              Ver más
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ServiceList;
