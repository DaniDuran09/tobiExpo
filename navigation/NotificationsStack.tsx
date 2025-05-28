import { createStackNavigator } from "@react-navigation/stack";
import { NotificationDetailScreen, NotificationsScreen } from "../screens/Notifications";
import { View } from "react-native";

export type NotificationsStackParamList = {
  NotificationsHome: undefined;
  NotificationDetail: {
    id: number;
    title: string;
    body: string;
  };
};

const Stack = createStackNavigator<NotificationsStackParamList>();

export default function NotificationsStack() {
    return (
        <Stack.Navigator 
            screenOptions={{ 
                headerShown: false,
            }}

        >
            <Stack.Screen 
                name="NotificationsHome" 
                component={NotificationsScreen} 
            />
            <Stack.Screen 
                name="NotificationDetail" 
                component={NotificationDetailScreen}
                options={{
                    headerShown: true,
                    headerBackTitleVisible: false,
                    title: "",
                    headerTintColor: "black",
                }}
            />
        </Stack.Navigator>
    );
}