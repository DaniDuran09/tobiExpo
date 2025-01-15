import { Colors } from "../../styles/Colors";
import { UserItem } from "./UserItem";

  export const RenderUsers = ({user, specialistId, setSpecialistId}) => {
    const isSelected = specialistId == user.id
    return (
      <UserItem
        style={specialistId && !isSelected && { opacity: 0.6 }}
        picture={{ uri: user.picture }}
        pictureContainerStyle={{          
          borderWidth: isSelected ? 3 : 0,
          borderColor: isSelected ? Colors.primaryColor : "transparent",
        }}
        name={user.display_name}
        onPress={() => {
          setSpecialistId(user)
        }}
        color={isSelected && Colors.primaryColor}
      />
    );
  };