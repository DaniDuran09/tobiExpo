import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "../screens/SplashScreen/SplashScreen";
import SignInScreen from "../screens/SignInScreen";
import SignInPetScreen from "../screens/SignInPetScreen";
import SignInPetInfo2Screen from "../screens/SignInPetInfo2Screen";
import SignInPetInfoScreen from "../screens/SignInPetInfoScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import MainTabScreen from "./MainTabScreen";
import SearchItem from "../components/SearchItem";
import { Colors } from "../styles/Colors";
import UserStepsRegister from "../screens/auth/register/UserStepsRegister";
import ForgotPassword from "../screens/auth/ForgotPassword";
import ChangePassword from "../screens/auth/ChangePassword";
import MailForm from "../screens/auth/register/MailForm";
import ValidateMail from "../screens/auth/register/ValidateMail";

const RootStack = createStackNavigator();

const RootStackScreen = ({}) => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="SplashScreen" component={SplashScreen} />
    <RootStack.Screen name="MailForm" component={MailForm}/>
    <RootStack.Screen name="ValidateMail" component={ValidateMail}/>
    <RootStack.Screen name="LoginScreen" component={LoginScreen} />
    <RootStack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTintColor: Colors.black,
        title: "Recuperar contraseña",
        headerTitleStyle: {
          color: Colors.primaryColor,
          fontWeight: "700",
        },
      }}
    />
    <RootStack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTintColor: Colors.black,
        title: "Recuperar contraseña",
        headerTitleStyle: {
          color: Colors.primaryColor,
          fontWeight: "700",
        },
      }}
    />
    <RootStack.Screen name="SignInScreen" component={SignInScreen} />
    <RootStack.Screen name="UserStepsRegister" component={UserStepsRegister} />
    <RootStack.Screen name="SignInPetScreen" component={SignInPetScreen} />
    <RootStack.Screen
      name="SignInPetInfoScreen"
      component={SignInPetInfoScreen}
    />
    <RootStack.Screen
      name="SignInPetInfo2Screen"
      component={SignInPetInfo2Screen}
    />
    <RootStack.Screen
      name="SearchItem"
      component={SearchItem}
      options={({ route }) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        headerTintColor: Colors.black,
        headerTitleStyle: {
          color: Colors.primaryColor,
          fontWeight: "700",
        },
        title:
          (route.params.type === "foodType" && "Buscar tipo de alimento") ||
          (route.params.type == "foodBrand" && "Buscar marca de alimento") ||
          (route.params.type == "pets_breeds" && "Buscar raza de mascota"),
      })}
    />
    <RootStack.Screen
      name="Home"
      component={MainTabScreen}
      options={{ headerShown: false, gestureEnabled: false }}
    />
  </RootStack.Navigator>
);

export default RootStackScreen;
