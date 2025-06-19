import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Alert,
  Linking,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";

import { useRoute } from "@react-navigation/native";
// Assume this is a React Native-compatible spinner
import { formatDateWithLan } from "../utils/formateDate";
import { useSelector } from "react-redux";

const AuctionDetails = ({ navigation }) => {
  const [tender, setTender] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalOffer, setTotalOffer] = useState("");
  const [technicalOffer, setTechnicalOffer] = useState(null);
  const [error, setError] = useState(null);

  // const user = useSelector((state) => state.session.user);
  const user = useSelector((state) => state.auth.user);
  const route = useRoute();
  const { id } = route.params || {};

  useEffect(() => {
    if (!id) return;

    const fetchTender = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://mazadoman.com/backend/api/auction/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch tender");
        const data = await res.json();
        setTender(data);
      } catch (err) {
        setError("Unable to fetch tender details");
      } finally {
        setLoading(false);
      }
    };

    fetchTender();
  }, [id]);

  const formatRemainingTime = (ms) => {
    if (ms <= 0) return "Bidding Closed";
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!tender?.bid_end_date) return;
      const deadline = new Date(`${tender.bid_end_date}T23:59:00+04:00`);
      const now = new Date();
      const timeDiff = deadline - now;
      setRemainingTime(formatRemainingTime(timeDiff));
    }, 1000);
    return () => clearInterval(interval);
  }, [tender?.bid_end_date]);

  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (result.type === "success") {
      setTechnicalOffer(result);
    }
  };

  const handleSubmit = async () => {
    if (!totalOffer || isNaN(totalOffer)) {
      setError("Invalid bid amount");
      return;
    }

    const token = await localStorage.getItem("authToken");
    if (!token || !user?.id) {
      setError("You must be logged in to bid");
      return;
    }

    const formData = new FormData();
    formData.append("offer_file", {
      uri: technicalOffer.uri,
      name: technicalOffer.name,
      type: "application/pdf",
    });
    formData.append("bid_amount", totalOffer);
    formData.append("user_id", user.id);
    formData.append("auction_id", id);

    setLoading(true);
    try {
      const response = await fetch(
        "https://mazadoman.com/backend/api/auctions/place-bid",
        {
          method: "POST",
          body: formData,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Failed to place bid");
      }

      showToast("Bid placed successfully!");
      navigation.navigate("Dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert("Notification", msg);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {tender && (
        <>
          <Image source={{ uri: tender.image }} style={styles.image} />
          <Text style={styles.title}>{tender.title}</Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Company:</Text> {tender.company_name}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Description:</Text> {tender.description}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Bid Price:</Text> {tender.budget} OMR
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Deadline:</Text>{" "}
            {formatDateWithLan(tender.bid_end_date)}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Created At:</Text>{" "}
            {formatDateWithLan(tender.created_at)}
          </Text>

          {tender.additional_files?.length > 0 && (
            <View>
              {tender.additional_files.map((file, index) => (
                <View key={index} style={styles.fileCard}>
                  <Text>Document {index + 1}</Text>
                  <View style={styles.fileActions}>
                    <Button
                      title="Download"
                      onPress={() => Linking.openURL(file.file_path)}
                    />
                    <Button
                      title="View"
                      onPress={() => Linking.openURL(file.file_path)}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.info}>
            <Text style={styles.label}>Latest Bid:</Text>{" "}
            {tender.latest_bid_price} OMR
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Remaining Time:</Text> {remainingTime}
          </Text>
        </>
      )}

      {user ? (
        <>
          {remainingTime === "Bidding Closed" ? (
            <Text style={styles.closedText}>Bidding Closed</Text>
          ) : (
            <View>
              <Text style={styles.subtitle}>Submit Your Bid</Text>
              {error && <Text style={styles.error}>{error}</Text>}
              <TextInput
                placeholder="Total Offer"
                style={styles.input}
                keyboardType="numeric"
                value={totalOffer}
                onChangeText={setTotalOffer}
              />
              <TouchableOpacity
                onPress={handlePickFile}
                style={styles.filePicker}
              >
                <Text>
                  {technicalOffer?.name || "Pick Technical Offer (PDF)"}
                </Text>
              </TouchableOpacity>
              <Button title="Submit Bid" onPress={handleSubmit} />
            </View>
          )}
        </>
      ) : (
        <View>
          <Text
            style={{
              marginVertical: 20,
              textAlign: "center",
              color: "red",
              fontSize: 15,
            }}
          >
            You must be logged in to bid
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  button: {
    backgroundColor: "#ed8936",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: { width: "100%", height: 200, borderRadius: 12, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  info: { fontSize: 16, marginBottom: 5 },
  label: { fontWeight: "bold" },
  subtitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  filePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  error: { color: "red", marginBottom: 10 },
  fileCard: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
  },
  fileActions: { flexDirection: "row", gap: 10, marginTop: 5 },
  closedText: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
});

export default AuctionDetails;
