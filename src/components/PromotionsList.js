import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import LoadingIndicator from "./LoadingIndicator";

export default function PromotionsList({ userId }) {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch(
          `https://mazadoman.com/backend/api/promotions/user/${userId}`
        );
        const data = await res.json();
        setPromotions(data.promotions);
      } catch (err) {
        console.error("Error fetching promotions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPromotions();
    }
  }, [userId]);

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <Text style={styles.header}>Promoted Products</Text>
          <View style={styles.grid}>
            {promotions.map((promo) => (
              <View key={promo.promotion_id} style={styles.card}>
                <Text style={styles.title}>{promo.title || "Untitled"}</Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Type: </Text>
                  {promo.target_type}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Duration: </Text>
                  {promo.duration_days} days
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>Start: </Text>
                  {formatDate(promo.start_date?.split("T")[0])}
                </Text>
                <Text style={styles.text}>
                  <Text style={styles.label}>End: </Text>
                  {formatDate(promo.end_date?.split("T")[0])}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    minHeight: "100%",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFA500",
    textAlign: "center",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "column",
  },
  card: {
    backgroundColor: "#A3E635",
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  label: {
    fontWeight: "600",
    color: "#4F46E5",
  },
});
