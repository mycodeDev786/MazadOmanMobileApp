import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

// Dummy user and translations
const dummyUser = { id: "123", company_name: "Dummy Company Inc." };
const t = {
  welcome: "Welcome",
  tendersPosted: "Tenders Posted",
  tendersQuoted: "Tenders Quoted",
  forwardAuctionsPosted: "Forward Auctions Posted",
  forwardBidsPlaced: "Forward Bids Placed",
  reverseAuctionsPosted: "Reverse Auctions Posted",
  reverseBidsPlaced: "Reverse Auctions Bids Placed",
  analyticsOverview: "Analytics Overview",
};

const screenWidth = Dimensions.get("window").width;

const LoadingSpinner = ({ isLoading }) =>
  isLoading ? (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : null;

export default function AdminDashboard() {
  const [data, setData] = useState({
    tenderPosted: 0,
    tenderQuoted: 0,
    forwardAuctionPosted: 0,
    forwardAuctionPlacedBids: 0,
    reverseAuctionPosted: 0,
    reverseAuctionPlacedBids: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

        setData({
          tenderPosted: 15,
          tenderQuoted: 8,
          forwardAuctionPosted: 10,
          forwardAuctionPlacedBids: 25,
          reverseAuctionPosted: 7,
          reverseAuctionPlacedBids: 18,
        });
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: [
      t.tendersPosted,
      t.tendersQuoted,
      t.forwardAuctionsPosted,
      t.forwardBidsPlaced,
      t.reverseAuctionsPosted,
      t.reverseBidsPlaced,
    ],
    datasets: [
      {
        data: [
          data.tenderPosted,
          data.tenderQuoted,
          data.forwardAuctionPosted,
          data.forwardAuctionPlacedBids,
          data.reverseAuctionPosted,
          data.reverseAuctionPlacedBids,
        ],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#e3e3e3",
      strokeDasharray: "0",
    },
    barPercentage: 0.6,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <LoadingSpinner isLoading={loading} />
        {error && <Text style={styles.errorText}>{error}</Text>}

        <Text style={styles.welcomeText}>
          {t.welcome},{" "}
          <Text style={styles.companyName}>{dummyUser.company_name}</Text>
        </Text>

        <View style={styles.gridContainer}>
          {[
            {
              title: t.tendersPosted,
              value: data.tenderPosted,
              style: styles.cardIndigo,
            },
            {
              title: t.tendersQuoted,
              value: data.tenderQuoted,
              style: styles.cardPurple,
            },
            {
              title: t.forwardAuctionsPosted,
              value: data.forwardAuctionPosted,
              style: styles.cardAmber,
            },
            {
              title: t.forwardBidsPlaced,
              value: data.forwardAuctionPlacedBids,
              style: styles.cardOrange,
            },
            {
              title: t.reverseAuctionsPosted,
              value: data.reverseAuctionPosted,
              style: styles.cardGreen,
            },
            {
              title: t.reverseBidsPlaced,
              value: data.reverseAuctionPlacedBids,
              style: styles.cardRed,
            },
          ].map((item, index) => (
            <View key={index} style={[styles.card, item.style]}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{t.analyticsOverview}</Text>
          {/* Centered BarChart to fix alignment */}
          <View style={{ alignItems: "center" }}>
            <BarChart
              data={chartData}
              width={screenWidth - 32} // full width minus padding
              height={700}
              chartConfig={chartConfig}
              verticalLabelRotation={60} // rotate to prevent cropping
              showValuesOnTopOfBars={true}
              fromZero={true}
              style={{ marginLeft: 0, borderRadius: 16 }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    zIndex: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  companyName: {
    color: "#f97316",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    width: "48%",
    height: "30%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIndigo: { backgroundColor: "#6366f1" },
  cardPurple: { backgroundColor: "#c084fc" },
  cardAmber: { backgroundColor: "#b45309" },
  cardOrange: { backgroundColor: "#f97316" },
  cardGreen: { backgroundColor: "#15803d" },
  cardRed: { backgroundColor: "#f87171" },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  chartContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
});
