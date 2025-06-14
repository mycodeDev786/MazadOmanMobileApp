import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlacedBidsScreen({ navigation }) {
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState([]);
  const [error, setError] = useState(null);

  const dummyBids = [
    {
      id: "1",
      auction_id: "AUC101",
      title: "Construction Equipment Auction",
      auction_type: "Forward",
    },
    {
      id: "2",
      auction_id: "AUC102",
      title: "Scrap Metal Sale",
      auction_type: "Reverse",
    },
    {
      id: "3",
      auction_id: "AUC103",
      title: "Office Furniture",
      auction_type: "Forward",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setBids(dummyBids);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredBids = bids.filter(
    (b) => filter === "all" || b.auction_type === filter
  );

  const handlePress = (auctionId) => {
    navigation.navigate("BidDetails", { id: auctionId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePress(item.auction_id)}
    >
      <Text style={styles.idText}>ID: {item.auction_id}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text
        style={[
          styles.typeBadge,
          item.auction_type === "Forward"
            ? styles.forwardType
            : styles.reverseType,
        ]}
      >
        {item.auction_type}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View style={styles.container}>
        <Text style={styles.header}>Placed Bids</Text>

        {/* Filter Buttons */}
        <View style={styles.filterRow}>
          {["all", "Forward", "Reverse"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterButton,
                filter === type && styles.activeFilterButton,
              ]}
              onPress={() => setFilter(type)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === type && styles.activeFilterText,
                ]}
              >
                {type} Auctions
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bids List */}
        <FlatList
          data={filteredBids}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    color: "#F97316",
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  activeFilterButton: {
    backgroundColor: "#9333EA",
    borderColor: "#9333EA",
  },
  filterText: {
    color: "#374151",
  },
  activeFilterText: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#FB923C",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
  },
  idText: {
    color: "#fff",
    fontSize: 13,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  typeBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
    overflow: "hidden",
  },
  forwardType: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
  },
  reverseType: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
});
