import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native-ui-lib";
import { Colors } from "../../styles/Colors";

export default function NotificationDetailScreen() {
    const { params } = useRoute<any>()
    return (
        <SafeAreaView style={{ gap: 8, padding: 20, backgroundColor: Colors.white, flex: 1, alignItems: "center" }}>
            <View width={60} height={60} backgroundColor={Colors.gray} br60 />
            <Text center text60>{params?.title}</Text>
            <Text text70>{params?.body}</Text>
        </SafeAreaView>
    )
}