import { createStackNavigator } from "@react-navigation/stack";
import { NotificationDetailScreen, NotificationsScreen } from "../screens/Notifications";
import { View } from "react-native";

const Stack = createStackNavigator()

export default function NotificationsStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="NotificationsHome" component={NotificationsScreen} />
            <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
        </Stack.Navigator>
    )
}