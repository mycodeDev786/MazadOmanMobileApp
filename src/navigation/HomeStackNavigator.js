// navigation/ProfileStackNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import TenderDetailScreen from "../screens/TenderDetailScreen";
import AuctionDetails from "../screens/AuctionDetails";
import CategoryPage from "../screens/CategoryPage";
import AllTendersScreen from "../screens/AllTendersScreen";
import AllForwardScreen from "../screens/AllForward";
import AllReverseScreen from "../screens/AllReverse";

const Stack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="TenderDetail" component={TenderDetailScreen} />
      <Stack.Screen name="AuctionDetail" component={AuctionDetails} />
      <Stack.Screen name="CategoryTender" component={CategoryPage} />
      <Stack.Screen name="AllTenders" component={AllTendersScreen} />
      <Stack.Screen name="AllForwardAuctions" component={AllForwardScreen} />
      <Stack.Screen name="AllReverseAuctions" component={AllReverseScreen} />
    </Stack.Navigator>
  );
}
