import { AnimatedImage, LoaderScreen, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";

export const RenderUsers = ({user, specialistId, setSpecialistId}) => {
    const isSelected = specialistId?.id == user.id
    return (
      <TouchableOpacity
        onPress={() => {
          setSpecialistId(user)
        }}
      >
        <View center marginR-25 style={specialistId && !isSelected && { opacity: 0.6 }}>
          <AnimatedImage
            source={{ uri: user.picture }}
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
          <Text color={isSelected && Colors.primaryColor} text70R>{user.display_name}</Text>
        </View>
      </TouchableOpacity>
    );
  };
