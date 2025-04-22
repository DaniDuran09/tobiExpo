import { View } from "react-native-ui-lib";
import { ZoomIn, ZoomOut } from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { Colors } from "../../styles/Colors";
import { ViewStyle } from "react-native";

export default function NotificationIcon({ badget = false, size = 24, color = "black", style }: { badget?: boolean, size?: number, color?: string, style?: ViewStyle }) {
    return (
        <View width={size} height={size} style={style} >
            <Icon name="bell-outline" size={size} color={color} />
            {

                badget &&
                <View
                    width={size / 2}
                    height={size / 2}
                    br60
                    absT absR
                    backgroundColor={Colors.red}
                    reanimated entering={ZoomIn.delay(500)} exiting={ZoomOut}
                />
            }
        </View>
    )
}