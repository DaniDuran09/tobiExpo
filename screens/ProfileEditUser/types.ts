import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";


type ProfileEditUserScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ProfileEditUser"
>;

type ProfileEditUserScreenRouteProp = RouteProp<
  RootStackParamList,
  "ProfileEditUser"
>;

interface ProfileEditUserProps {
  navigation: ProfileEditUserScreenNavigationProp;
  route: ProfileEditUserScreenRouteProp;
}
