import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  I18nManager,
  StatusBar,
} from "react-native";
import { useTranslation } from "react-i18next";

const screenWidth = Dimensions.get("window").width;
const cardSize = (screenWidth - 60) / 2;
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListingScreen({ navigation }) {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  const cards = [
    {
      title: "Tenders Published",
      onPress: () => console.log("Go to Tenders Published"),
    },
    {
      title: "Tenders Quoted",
      onPress: () => console.log("Go to Tenders Quoted"),
    },
    {
      title: "Auctions Listed",
      onPress: () => console.log("Go to Auctions Listed"),
    },
    {
      title: "Bids Submitted (Auctions)",
      onPress: () => console.log("Go to Bids Submitted"),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#ed8936" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <Text
          style={[
            styles.header,
            {
              textAlign: "center",
            },
          ]}
        >
          All Listings
        </Text>
        <View
          style={[
            styles.grid,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          {cards.map((card, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { direction: isRTL ? "rtl" : "ltr" }]}
              onPress={card.onPress}
              activeOpacity={0.85}
            >
              <Text style={styles.cardText}>{card.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ed8936",
    textAlign: "center",
    marginBottom: 20,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: cardSize,
    height: cardSize,
    backgroundColor: "#ed8936", // Background color of entire screen
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
    paddingHorizontal: 8,
  },
});
