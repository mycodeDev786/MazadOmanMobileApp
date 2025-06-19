import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingIndicator from "../components/LoadingIndicator";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const screenWidth = Dimensions.get("window").width;

export default function AdminDashboard() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const [tenderPosted, setTenderPosted] = useState(0);
  const [tenderQuoted, setTenderQuoted] = useState(0);
  const [forwardAuctionPosted, setForwardAuctionPosted] = useState(0);
  const [forwardAuctionPlacedBids, setForwardAuctionPlacedBids] = useState(0);
  const [reverseAuctionPosted, setReverseAuctionPosted] = useState(0);
  const [reverseAuctionPlacedBids, setReverseAuctionPlacedBids] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tenderResponse = await fetch(
          `https://mazadoman.com/backend/api/tenders/count/${user?.id}`
        );
        const quoteResponse = await fetch(
          `https://mazadoman.com/backend/api/quotes/count/user/${user?.id}`
        );
        const forwardAuctionResponse = await fetch(
          `https://mazadoman.com/backend/api/auctions/user/${user?.id}/count/forward`
        );
        const reverseAuctionResponse = await fetch(
          `https://mazadoman.com/backend/api/auctions/user/${user?.id}/count/reverse`
        );
        const forwardBidsResponse = await fetch(
          `https://mazadoman.com/backend/api/user/bids/forward/${user?.id}`
        );
        const reverseBidsResponse = await fetch(
          `https://mazadoman.com/backend/api/user/bids/reverse/${user?.id}`
        );

        if (
          !tenderResponse.ok ||
          !quoteResponse.ok ||
          !forwardAuctionResponse.ok ||
          !reverseAuctionResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const tenderData = await tenderResponse.json();
        const quoteData = await quoteResponse.json();
        const forwardAuctionData = await forwardAuctionResponse.json();
        const reverseAuctionData = await reverseAuctionResponse.json();
        const forwardBidsData = await forwardBidsResponse.json();
        const reverseBidsData = await reverseBidsResponse.json();

        setTenderPosted(tenderData.tender_count);
        setTenderQuoted(quoteData.quote_count);
        setForwardAuctionPosted(forwardAuctionData.forward_auction_count);
        setReverseAuctionPosted(reverseAuctionData.reverse_auction_count);
        setForwardAuctionPlacedBids(forwardBidsData.forward_bids_count);
        setReverseAuctionPlacedBids(reverseBidsData.reverse_bids_count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const chartData = {
    labels: [
      t("admin.tendersPosted"),
      t("admin.tendersQuoted"),
      t("admin.forwardAuctionsPosted"),
      t("admin.forwardBidsPlaced"),
      t("admin.reverseAuctionsPosted"),
      t("admin.reverseBidsPlaced"),
    ],
    datasets: [
      {
        data: [
          tenderPosted,
          tenderQuoted,
          forwardAuctionPosted,
          forwardAuctionPlacedBids,
          reverseAuctionPosted,
          reverseAuctionPlacedBids,
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
      {loading && <LoadingIndicator />}
      <ScrollView contentContainerStyle={styles.container}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <View
          style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20 }}
        >
          <Text style={styles.welcomeText}>{t("admin.welcome")} : </Text>
          <Text style={[styles.welcomeText, styles.companyName]}>
            {user.company_name}
          </Text>
        </View>

        <View style={styles.gridContainer}>
          {[
            {
              title: t("admin.tendersPosted"),
              value: tenderPosted,
              style: styles.cardIndigo,
            },
            {
              title: t("admin.tendersQuoted"),
              value: tenderQuoted,
              style: styles.cardPurple,
            },
            {
              title: t("admin.forwardAuctionsPosted"),
              value: forwardAuctionPosted,
              style: styles.cardAmber,
            },
            {
              title: t("admin.forwardBidsPlaced"),
              value: forwardAuctionPlacedBids,
              style: styles.cardOrange,
            },
            {
              title: t("admin.reverseAuctionsPosted"),
              value: reverseAuctionPosted,
              style: styles.cardGreen,
            },
            {
              title: t("admin.reverseBidsPlaced"),
              value: reverseAuctionPlacedBids,
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
          <Text style={styles.chartTitle}>{t("admin.analyticsOverview")}</Text>
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
    lineHeight: 32, // Add this
    color: "#333",
  },

  companyName: {
    color: "#f97316",
    fontWeight: "bold",
    fontSize: 26,
    lineHeight: 32, // Match the welcomeText lineHeight
  },
  gridContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    width: "100%", // Full width
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
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
