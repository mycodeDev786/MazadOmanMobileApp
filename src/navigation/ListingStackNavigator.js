import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ListingScreen from "../screens/ListingScreen";
import TenderPostedScreen from "../screens/TenderPostedScreen";
import TenderQuotedScreen from "../screens/TenderQuotedScreen";
import PostedAuctionsScreen from "../screens/PostedAuctionsScreen";
import PlacedBidsScreen from "../screens/PlacedBidsScreen";
import TenderDetailsScreen from "../screens/TenderDetailsScreen";
import TenderQuoteScreen from "../screens/TenderQuoteScreen";
import AuctionDetailScreen from "../screens/AuctionDetailScreen";
import AuctionBidDetailsScreen from "../screens/AuctionBidDetailsScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListingMain" component={ListingScreen} />
      <Stack.Screen name="TenderPosted" component={TenderPostedScreen} />
      <Stack.Screen name="TenderQuoted" component={TenderQuotedScreen} />
      <Stack.Screen name="PostedAuctions" component={PostedAuctionsScreen} />
      <Stack.Screen name="PlacedBids" component={PlacedBidsScreen} />
      <Stack.Screen name="TenderDetail" component={TenderDetailsScreen} />
      <Stack.Screen name="TenderQuotedDetail" component={TenderQuoteScreen} />
      <Stack.Screen name="AuctionDetail" component={AuctionDetailScreen} />
      <Stack.Screen name="BidDetails" component={AuctionBidDetailsScreen} />
    </Stack.Navigator>
  );
}
