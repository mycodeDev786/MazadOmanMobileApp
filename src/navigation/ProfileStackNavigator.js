// navigation/ProfileStackNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import AdminDashboard from "../screens/DashboardScreen";
import ProfileView from "../screens/ProfileView";
import PromotedPage from "../screens/PromotionsScreen";
import PromotionScreen from "../screens/PromotionScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Dashboard" component={AdminDashboard} />
      <Stack.Screen name="ProfileView" component={ProfileView} />
      <Stack.Screen name="PromotedProduct" component={PromotedPage} />
     
    </Stack.Navigator>
  );
}
