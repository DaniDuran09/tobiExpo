import React from "react";

import { View, Text, TouchableOpacity } from "react-native-ui-lib";
import { Colors } from "../../../../styles/Colors";
import { AnimatedImage, LoaderScreen } from "react-native-ui-lib";
import { FlatList } from "react-native";

const ListSelectPet: React.FC<ListSelectPetProps> = ({
  pets,
  selectedPet,
  setSelectedPet,
}) => {
  return (
    <View row spread>
      <Text>Mis mascotas</Text>
      <View row gap-10 centerV>
        <FlatList
          data={pets}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedPet(item)}
              style={
                selectedPet?.id === item.id
                  ? {
                      borderWidth: 2,
                      borderColor: Colors.primaryColor,
                      borderRadius: 32,
                    }
                  : {}
              }
            >
              <AnimatedImage
                source={{ uri: item.picture || "" }}
                height={30}
                width={30}
                borderRadius={11}
                loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
                animationDuration={500}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity>
          <View
            height={30}
            width={30}
            center
            br100
            backgroundColor={Colors.lightGray}
          >
            <Text>+</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ListSelectPet;
