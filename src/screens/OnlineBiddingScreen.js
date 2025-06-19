import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function OnlineBidding() {
  const [fullBidTender, setFullBidTender] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");
  const [currentBids, setCurrentBids] = useState([]);
  const [upcomingBids, setUpcomingBids] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidPlaced, setBidPlaced] = useState(false);
  const [userBidAmount, setUserBidAmount] = useState("");

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!fullBidTender) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(
        `${fullBidTender.bid_start_date}T${fullBidTender.bid_end_time}`
      ).getTime();

      const distance = end - now;

      if (distance <= 0) {
        setRemainingTime("00:00:00");
        clearInterval(interval);
      } else {
        const hours = String(Math.floor(distance / (1000 * 60 * 60))).padStart(
          2,
          "0"
        );
        const minutes = String(
          Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        ).padStart(2, "0");
        const seconds = String(
          Math.floor((distance % (1000 * 60)) / 1000)
        ).padStart(2, "0");

        setRemainingTime(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fullBidTender]);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch(
          `https://mazadoman.com/backend/api/bids/user/${user?.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch bids");

        const data = await response.json();
        setBids(data.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [user?.id]);

  useEffect(() => {
    const now = new Date();

    const tendersWithDates = bids.map((bid) => ({
      ...bid,
      startDate: new Date(`${bid.bid_start_date}T${bid.bid_start_time}`),
      endDate: new Date(`${bid.bid_start_date}T${bid.bid_end_time}`),
    }));

    const fullBid = tendersWithDates.find((tender) => {
      const timeUntilStart = tender.startDate.getTime() - now.getTime();
      return timeUntilStart <= 30 * 60 * 1000 && tender.endDate > now;
    });

    if (fullBid) {
      setFullBidTender(fullBid);
    } else {
      const current = tendersWithDates.filter((t) => {
        const timeLeft = t.endDate.getTime() - now.getTime();
        return (
          t.startDate <= now &&
          t.endDate > now &&
          timeLeft <= 24 * 60 * 60 * 1000
        );
      });

      const upcoming = tendersWithDates.filter((t) => t.startDate > now);
      setCurrentBids(current);
      setUpcomingBids(upcoming);
    }
  }, [bids]);

  const handleBidSubmit = async () => {
    if (!userBidAmount || isNaN(userBidAmount) || userBidAmount <= 0) {
      Alert.alert("Invalid Bid", "Please enter a valid amount.");
      return;
    }

    const bidData = {
      bid_id: fullBidTender.id,
      user_id: user.id,
      offered_price: userBidAmount,
    };

    try {
      const response = await fetch(
        "https://www.mazadoman.com/backend/api/bid-user",
        {
          method: "POST",
          body: JSON.stringify(bidData),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Your bid has been placed successfully.");
        setBidPlaced(true);
      } else {
        Alert.alert("Bid Failed", data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Bid Failed", "Something went wrong.");
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {loading && <LoadingIndicator />}
        <Text style={styles.title}>Welcome: {user?.company_name}</Text>

        {fullBidTender ? (
          <>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Start Time: {fullBidTender.bid_start_time}
              </Text>
              <Text style={styles.infoText}>
                End Time: {fullBidTender.bid_end_time}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardText}>
                Tender No: {fullBidTender.tender_id}
              </Text>
              <Text style={styles.cardText}>
                Tender Name: {fullBidTender.tender.title}
              </Text>
              <Text style={styles.cardText}>
                Bidders: {fullBidTender.bidders.length}
              </Text>
            </View>

            <View style={styles.bidSection}>
              <Text style={styles.timerText}>⏳ {remainingTime}</Text>
              <Text style={styles.bidPrice}>
                {fullBidTender.bidding_price} OMR
              </Text>

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="00.00"
                  value={userBidAmount}
                  onChangeText={setUserBidAmount}
                />
                <Button
                  title="Bid Now"
                  onPress={handleBidSubmit}
                  disabled={bidPlaced}
                />
              </View>
            </View>
          </>
        ) : (
          <>
            {currentBids.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Biddings</Text>
                {currentBids.map((bid) => (
                  <View key={bid.id} style={styles.card}>
                    <Text style={styles.cardText}>{bid.tenderName}</Text>
                    <Text style={styles.cardText}>
                      Tender No: {bid.tender_id}
                    </Text>
                    <Text style={styles.cardText}>End Time: {bid.endTime}</Text>
                  </View>
                ))}
              </View>
            )}

            {upcomingBids.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upcoming Biddings</Text>
                {upcomingBids.map((bid) => (
                  <View key={bid.id} style={styles.card}>
                    <Text style={styles.cardText}>
                      Tender: {bid.tender.title}
                    </Text>
                    <Text style={styles.cardText}>
                      Tender No: {bid.tender_id}
                    </Text>
                    <Text style={styles.cardText}>
                      Start Date: {bid.bid_start_date}
                    </Text>
                    <Text style={styles.cardText}>
                      Start Time: {bid.bid_start_time}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {currentBids.length === 0 && upcomingBids.length === 0 && (
              <Text
                style={{
                  textAlign: "center",
                  paddingVertical: 10,
                  color: "red",
                }}
              >
                No bids found.
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F97316",
    marginBottom: 20,
  },
  infoBox: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  card: {
    backgroundColor: "#E9D5FF",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  bidSection: {
    alignItems: "center",
    gap: 12,
  },
  timerText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  bidPrice: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#F59E0B",
    padding: 10,
    width: 100,
    borderRadius: 8,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#059669",
    marginBottom: 12,
    fontWeight: "600",
  },
});
