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
import { useSelector } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";

export default function PlacedBidsScreen({ navigation }) {
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState([]);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth.user);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setError("");
      setLoading(false);
      return;
    }

    fetch(`https://mazadoman.com/backend/api/user/bids/details/${userId}`)
      .then((response) => {
        if (!response.ok) throw new Error("");
        return response.json();
      })
      .then((data) => {
        setBids(data.bids);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

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
    return <LoadingIndicator />;
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
          keyExtractor={(item) => item.auction_id}
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
