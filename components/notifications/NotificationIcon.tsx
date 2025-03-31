import { View } from "react-native-ui-lib";
import { ZoomIn, ZoomOut } from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { Colors } from "../../styles/Colors";

export default function NotificationIcon({ badget = false }: { badget: boolean }) {
    return (
        <View width={32} height={32}>
            <Icon name="bell-outline" size={32} />
            {

                badget &&
                <View
                    width={13}
                    height={13}
                    br60
                    absT absR
                    backgroundColor={Colors.red}
                    reanimated entering={ZoomIn.delay(500)} exiting={ZoomOut}
                />
            }
        </View>
    )
}