import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatDate } from "../utils/formateDate";

const AllTendersScreen = ({ navigation, route }) => {
  const activeTab = "Tenders";
  const title = "Tenders";
  const [loading, setLoading] = useState(true);
  const [tenders, setTenders] = useState([]);
  const [forwardAuctions, setForwardAuctions] = useState([]);
  const [reverseAuctions, setReverseAuctions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your real API URL
    fetch("https://mazadoman.com/backend/api/tenders")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tenders.");
        }
        return response.json();
      })
      .then((data) => {
        setTenders(data.tenders); // depends on your API response
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `https://mazadoman.com/backend/${item?.image}` }}
        style={styles.cardImage}
      />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          Launched On: {formatDate(item.created_at)}
        </Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {activeTab === "Tenders" ? item.tender_id : item.auction_id}:{" "}
          {item.title}
        </Text>
        <Text style={styles.cardBudget}>Budget: {item.budget} OMR</Text>
        <TouchableOpacity
          onPress={() => {
            activeTab === "Tenders"
              ? navigation.navigate("TenderDetail", {
                  id: item.tender_id,
                })
              : navigation.navigate("AuctionDetail", {
                  id: item.auction_id,
                });
          }}
          style={styles.detailButton}
        >
          <Text style={styles.detailButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      <View style={{ paddingVertical: 10 }}>
        <Text style={styles.tenderHeaderTitle}> All {title}</Text>
        <FlatList
          data={
            activeTab === "Tenders"
              ? tenders
              : activeTab === "Forward Auction"
              ? forwardAuctions
              : reverseAuctions
          }
          renderItem={renderCard}
          keyExtractor={(item) =>
            activeTab === "Tenders" ? item.tender_id : item.auction_id
          }
          contentContainerStyle={styles.cardList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tenderHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "orange", // Tailwind slate-800
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
});
export default AllTendersScreen;
