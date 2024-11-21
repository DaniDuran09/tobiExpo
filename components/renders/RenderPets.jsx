import { AnimatedImage, LoaderScreen, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";

export const RenderPets = ({pet, selectedPet, handleSelectPet}) => {
    const isSelected = selectedPet?.id === pet.id;
    return (
      <TouchableOpacity onPress={() => handleSelectPet(pet)}>
        <View
          center
          marginR-25
          style={selectedPet && !isSelected && { opacity: 0.6 }}
        >
          <AnimatedImage
            source={{ uri: pet?.picture }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 64,
              borderWidth: isSelected ? 3 : 0,
              borderColor: isSelected ? Colors.primaryColor : "transparent",
            }}
            loader={<LoaderScreen color={Colors.primaryColor} size={35} />}
            animationDuration={500}
            resizeMode="cover"
          />
          <Text color={isSelected && Colors.primaryColor} text70R>
            {pet?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };