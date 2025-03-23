import { View,Text, TouchableOpacity } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";

interface RenderNotificationProps{
    content:string|null
    date:number
    title:string
    onPress:()=>void
}

export default function RenderNotification({content,date,title,onPress}:RenderNotificationProps) {
    return (
        <TouchableOpacity backgroundColor={title === "Nuevas"?Colors.lightBlue:Colors.lightGray} padding-20
            style={{elevation:4}}
            onPress={onPress}
        >
            <Text text70M>{content}</Text>
        </TouchableOpacity>
    )
}