import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Linking,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingIndicator from "../components/LoadingIndicator";

export default function AuctionBidDetailsScreen() {
  const route = useRoute();
  const id = route.params?.id;
  const user = useSelector((state) => state.auth.user);
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalOffer, setTotalOffer] = useState("");
  const [technicalOffer, setTechnicalOffer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);

  useEffect(() => {
    const fetchTender = async () => {
      try {
        const res = await fetch(
          `https://mazadoman.com/backend/api/auction/bid-by-user/${id}/${user?.id}`
        );
        const data = await res.json();
        setTender(data.bid);
        setTotalOffer(data.bid.bid_amount?.toString());
      } catch (error) {
        Alert.alert("Error", "Failed to fetch tender");
      } finally {
        setLoading(false);
      }
    };

    fetchTender();
  }, [id]);

  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result.type === "success") {
      setTechnicalOffer(result);
    }
  };

  const handleSubmit = async () => {
    if (!totalOffer) {
      Alert.alert("Validation", "Please enter your bid amount.");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    formData.append("bid_amount", totalOffer);
    if (technicalOffer) {
      formData.append("offer_file", {
        uri: technicalOffer.uri,
        name: technicalOffer.name,
        type: "application/pdf",
      });
    }
    formData.append("_method", "PUT");

    try {
      const response = await fetch(
        `https://mazadoman.com/backend/api/auction/bid/update/${tender.bid_id}`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = await response.json();
      if (!response.ok) {
        Alert.alert("Error", result.message || "Failed to update bid");
      } else {
        Alert.alert("Success", "Bid updated successfully");
        setShowEditModal(false);
        setShowResubmitModal(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update bid");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    if (!status) return styles.statusDefault;
    const lower = status.toLowerCase();
    if (lower.includes("accept")) return styles.statusAccepted;
    if (lower.includes("reject")) return styles.statusRejected;
    if (lower.includes("pending")) return styles.statusPending;
    return styles.statusDefault;
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Placed Bid Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Auction ID:</Text>
          <Text>{tender?.auction_id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Auction Title:</Text>
          <Text>{tender?.title}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Placed Bid:</Text>
          <Text>{tender?.bid_amount} OMR</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.statusBadge, getStatusStyle(tender?.status)]}>
            {tender?.status}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Offer File:</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                `https://mazadoman.com/backend/${tender?.offer_file}`
              )
            }
          >
            <Text style={styles.link}>Download</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.fullButton, { backgroundColor: "#eab308" }]}
            onPress={() => setShowEditModal(true)}
          >
            <Text style={styles.buttonText}>✏️ Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.fullButton, { backgroundColor: "#16a34a" }]}
            onPress={() => setShowResubmitModal(true)}
          >
            <Text style={styles.buttonText}>📤 Resubmit</Text>
          </TouchableOpacity>
        </View>

        {/* Modal */}
        {(showEditModal || showResubmitModal) && (
          <Modal transparent={true} animationType="slide" visible>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {showEditModal ? "Edit Bid" : "Resubmit Bid"}
                </Text>

                <Text style={styles.label}>Bid Amount (OMR):</Text>
                <TextInput
                  style={styles.input}
                  value={totalOffer}
                  onChangeText={setTotalOffer}
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Upload Offer File (PDF):</Text>
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={handlePickFile}
                >
                  <Text>
                    {technicalOffer ? technicalOffer.name : "Choose File"}
                  </Text>
                </TouchableOpacity>

                <View style={styles.modalButtons}>
                  <Button
                    title="Cancel"
                    color="#9ca3af"
                    onPress={() => {
                      setShowEditModal(false);
                      setShowResubmitModal(false);
                    }}
                  />
                  <Button title="Submit" onPress={handleSubmit} />
                </View>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f97316",
    textAlign: "center",
    marginBottom: 16,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    color: "#6b7280",
  },
  link: {
    color: "#2563eb",
    textDecorationLine: "underline",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 999,
    color: "#fff",
    marginTop: 4,
  },
  statusAccepted: {
    padding: 10,
    backgroundColor: "#22c55e",
  },
  statusRejected: {
    backgroundColor: "#ef4444",
  },
  statusPending: {
    padding: 20,
    backgroundColor: "#eab308",
    borderRadius: 10,
  },
  statusDefault: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#9ca3af",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  uploadBtn: {
    backgroundColor: "#f3f4f6",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  buttonGroup: {
    gap: 12,
    marginVertical: 20,
  },
  fullButton: {
    paddingVertical: 12,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
