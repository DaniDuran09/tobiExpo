import React, { useEffect, useRef, useState } from "react";
import AppStorage from "../modules/AppStorage";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/slice/userSlice";
import HealthSlide from "./onboarding/HealthSlide";
import DigitalizeSlide from "./onboarding/DigitizeSlide";
import CustomizeSlide from "./onboarding/CustomizeSlide";
import { Carousel } from "react-native-ui-lib";
import { StackScreenProps } from "@react-navigation/stack";
import { Colors } from "../styles/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import { Button, Platform, View,Text } from "react-native";
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const sendPushNotification = async (expoPushToken:string, message:string) => {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: 'default',
      title: 'Test Notification',
      body: message,
    }),
  });

  const data = await response.json();
  console.log({data});
};



async function registerForPushNotificationsAsync() {
  try
  {
   

    const expoPushToken = await Notifications.getExpoPushTokenAsync({});
    return expoPushToken.data

  }
  catch(error){
    console.log(error)
  }
 
}

type NavigationProps = StackScreenProps<any>;


const SplashScreen = ({ navigation }: NavigationProps) => {
  const [token, setToken] = useState(null);
  const appStorage = new AppStorage();
  const dispatch = useDispatch();

  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  useEffect(() => {
    fetchData();
  }, []);

  console.log({expoPushToken})

  const fetchData = async () => {
    try {
      const response = await appStorage.getAppToken();
      const user = await appStorage.getUser();
      if (response && user) {
        setToken(response);
        dispatch(setUserInfo(user));
        navigation.navigate("Home");
      }
    } catch (error) {
      console.log("Error en el splash: ", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.danger }}>
      <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <Text>{`Channels: ${JSON.stringify(
        channels.map(c => c.id),
        null,
        2
      )}`}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken,"Hello world");
        }}
      />
    </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
