import { ReactNode } from "react";
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  HomeProfileDetails: { item: any; tabIndex: number };
};

export type NavigationProp = StackNavigationProp<RootStackParamList, "HomeProfileDetails">;

export interface SectionProps {
  children: ReactNode;
  item: any;
  tabIndex: number;
}
