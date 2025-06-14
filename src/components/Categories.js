import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";

// Dummy `translations` and `assets` placeholders
const translations = {
  en: {
    categories: "Categories",
    property: "Property",
    land: "Land",
    smallGadget: "Small Gadgets",
    homeAppliance: "Home Appliances",
    kitchenAppliance: "Kitchen Appliances",
    phoneAndTablet: "Phones & Tablets",
    watches: "Watches",
    healthAndBeauty: "Health & Beauty",
    personalCare: "Personal Care",
    facilityManagement: "Facility Management",
  },
};

const categories = [
  {
    id: "sub-22-4",
    key: "property",
    iconSrc: require("../../assets/c1.png"),
    bg: "#E0E7FF",
  },
  {
    id: "sub-1-5",
    key: "land",
    iconSrc: require("../../assets/land.png"),
    bg: "#E9D5FF",
  },
  {
    key: "smallGadget",
    iconSrc: require("../../assets/smart.png"),
    bg: "#FFE4E6",
  },
  {
    id: "sub-101-1",
    key: "homeAppliance",
    iconSrc: require("../../assets/domest_app.png"),
    bg: "#E0F2FE",
  },
  {
    id: "sub-101-2",
    key: "kitchenAppliance",
    iconSrc: require("../../assets/kitchen.png"),
    bg: "#D1FAE5",
  },
  {
    id: "sub-101-3",
    key: "phoneAndTablet",
    iconSrc: require("../../assets/mobile.png"),
    bg: "#FEE2E2",
  },
  {
    id: "sub-101-4",
    key: "watches",
    iconSrc: require("../../assets/watches.png"),
    bg: "#CCFBF1",
  },
  {
    id: "sub-102-1",
    key: "healthAndBeauty",
    iconSrc: require("../../assets/beauty.png"),
    bg: "#EDE9FE",
  },
  {
    id: "sub-102-2",
    key: "personalCare",
    iconSrc: require("../../assets/skin.png"),
    bg: "#FEF3C7",
  },
  {
    id: "sub-103-1",
    key: "facilityManagement",
    iconSrc: require("../../assets/facility.png"),
    bg: "#FFE4E6",
  },
];

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const itemSize = (screenWidth - 32 - 12 * (numColumns - 1)) / numColumns;

export default function Categories({
  type = "product",
  language = "en",
  navigation,
}) {
  const t = translations[language];

  const handleCategoryClick = (id) => {
    if (!id) return;
    navigation.navigate("CategoryTender", {
      id,
      type,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.categories}</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id || item.key}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: "white", width: itemSize, height: itemSize },
            ]}
            onPress={() => handleCategoryClick(item.id)}
          >
            <Image
              source={item.iconSrc}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.label} numberOfLines={2}>
              {t[item.key]}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FB923C", // Tailwind's orange-400
    textAlign: "center",
    marginBottom: 12,
  },
  grid: {
    alignItems: "center",
  },
  card: {
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    padding: 8,
    marginHorizontal: 5,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
