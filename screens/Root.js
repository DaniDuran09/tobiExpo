import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import RootStackScreen from "../navigation/RootStackScreen";


const Drawer = createDrawerNavigator();

const Root = () => {

  return (
    <NavigationContainer>
        <RootStackScreen />
    </NavigationContainer>
  );
};

export default Root;
