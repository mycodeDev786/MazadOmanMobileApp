import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/loginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import BottomTabNavigator from "./BottomTabNavigator";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import CreateAuctionScreen from "../screens/CreateAuctionScreen";
import CreateTenderScreen from "../screens/CreateTenderScreen";
import PaymentScreen from "../screens/PaymentScreen";
import PromotionScreen from "../screens/PromotionScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="CreateAuction" component={CreateAuctionScreen} />
      <Stack.Screen name="CreateTender" component={CreateTenderScreen} />
      <Stack.Screen name="Pay" component={PaymentScreen} />
      <Stack.Screen name="Promotion" component={PromotionScreen} />
    </Stack.Navigator>
  );
}
