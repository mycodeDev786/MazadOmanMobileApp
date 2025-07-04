import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";

export default function PostedAuctionsScreen({ navigation }) {
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setError("");
      setLoading(false);
      return;
    }

    fetch(`https://mazadoman.com/backend/api/auctions/user/${userId}`)
      .then((response) => {
        if (!response.ok) throw new Error("");
        return response.json();
      })
      .then((data) => {
        setAuctions(data.auctions);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  const filteredAuctions = auctions.filter(
    (a) => filter === "all" || a.auction_type === filter
  );

  const handleAuctionPress = (auctionId) => {
    navigation.navigate("AuctionDetail", { id: auctionId });
  };

  const renderAuctionCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleAuctionPress(item.auction_id)}
    >
      <Text style={styles.idText}>ID: {item.auction_id}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>Latest Bid: {item.latest_bid_price} OMR</Text>
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
        <LoadingIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Posted Auctions</Text>

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
                  styles.filterButtonText,
                  filter === type && styles.activeFilterButtonText,
                ]}
              >
                {type} Auctions
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Auctions List */}
        <FlatList
          data={filteredAuctions}
          keyExtractor={(item) => item.auction_id}
          renderItem={renderAuctionCard}
          contentContainerStyle={styles.auctionList}
          numColumns={1}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 50,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#F97316",
    textAlign: "center",
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  activeFilterButton: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  filterButtonText: {
    color: "#333",
  },
  activeFilterButtonText: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#FB923C",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  idText: {
    fontSize: 13,
    color: "#fff",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "#2F855A",
    fontWeight: "600",
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
  auctionList: {
    paddingBottom: 50,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
