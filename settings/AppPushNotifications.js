import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
// import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default class AppPushNotifications {
  constructor() {
    this.appStorage = new AppStorage();
  }

  async registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("No te podremos enviar notificaciones");
      return;
    }

    // const projectId =
    //   Constants?.expoConfig?.extra?.eas?.projectId ??
    //   Constants?.easConfig?.projectId;
    // if (!projectId) {
    //   alert("Project ID not found");
    // }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("PUSH TOKsEN => ", token);
    // await this.appStorage.savePushToken(token);
    // } else {
    //   // alert('Must use physical device for Push Notifications');
    // }
  }
}
