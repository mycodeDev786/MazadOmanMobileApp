import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Categories from "../components/Categories";
import VisualSlider from "../components/VisualSlider";

const dummyTenders = [
  {
    tender_id: "TDR001",
    title: "Road Construction Project",
    budget: 50000,
    image:
      "https://mazadoman.com/backend/uploads/auctions/1748409434_img_Adelaide-Rural-Salvage-8901-500x500.jpg",
    created_at: "2025-06-01",
  },
  {
    tender_id: "TDR002",
    title: "Bridge Renovation",
    budget: 75000,
    image:
      "https://mazadoman.com/backend/uploads/tenders/1748586275_Untitled%20design%20(1).png",
    created_at: "2025-06-03",
  },
  // Add more dummy items if needed
];

export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("Tenders");

  const tabs = ["Tenders", "Forward Auction", "Reverse Auction"];

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Launched On: {item.created_at}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {item.tender_id}: {item.title}
        </Text>
        <Text style={styles.cardBudget}>Budget: ${item.budget}</Text>
        <TouchableOpacity style={styles.detailButton}>
          <Text style={styles.detailButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Image
          source={require("../../assets/hero.png")}
          style={styles.heroImage}
        />
        <Text style={styles.heroText}>Find Opportunities</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab && styles.tabButtonTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Box */}
      <View style={styles.searchBox}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search by title or ID"
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Slider */}
      <View style={styles.centeredSection}>
        <VisualSlider />
      </View>

      {/* Categories */}
      <View style={styles.centeredSection}>
        <Categories />
      </View>

      {/* 💥 Tender Section Title */}
      {activeTab === "Tenders" && (
        <View style={styles.tenderHeader}>
          <Text style={styles.tenderHeaderTitle}>Latest</Text>
          <TouchableOpacity
            style={styles.tenderHeaderButton}
            onPress={() => navigation.navigate("Tenders")} // Adjust as needed
          >
            <Text style={styles.tenderHeaderLink}>See All</Text>
            <Text style={styles.tenderHeaderArrow}>➜</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={"#F9F9F9"} />
      <FlatList
        data={
          activeTab === "Tenders"
            ? dummyTenders
            : activeTab === "Forward Auction"
            ? ""
            : ""
        }
        renderItem={renderCard}
        keyExtractor={(item) => item.tender_id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.cardList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F9F9",
  },
  centeredSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  hero: {
    position: "relative",
    backgroundColor: "#000",
  },
  heroImage: {
    width: "100%",
    height: 200,
  },
  heroText: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabButtonActive: {
    borderBottomColor: "orange",
  },
  tabButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  tabButtonTextActive: {
    color: "orange",
  },
  searchBox: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#FFF",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  searchInput: {
    flex: 1,
    padding: 12,
  },
  searchButton: {
    backgroundColor: "orange",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cardList: {
    padding: 16,
    backgroundColor: "#F9F9F9",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEE",
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#f59e0b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#4B0082",
    marginBottom: 4,
  },
  cardBudget: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  detailButton: {
    backgroundColor: "#f59e0b",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  detailButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  tenderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  tenderHeaderTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b", // Tailwind slate-800
  },

  tenderHeaderButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  tenderHeaderLink: {
    color: "#f59e0b", // Tailwind amber-500
    fontWeight: "600",
    textDecorationLine: "underline",
    marginRight: 4,
  },

  tenderHeaderArrow: {
    transform: [{ rotate: "-45deg" }],
    marginTop: 2,
    color: "#f59e0b",
  },
});
