import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import LoadingIndicator from "../components/LoadingIndicator";

export default function AuctionDetailScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [editTender, setEditTender] = useState({ title: "", description: "" });
  const [bidEndDate, setBidEndDate] = useState("2025-06-30");
  const [loading, setLoading] = useState(true);

  const dummyTender = {
    auction_id: "1234",
    title: "Sample Auction",
    auction_type: "Forward",
    description: "This is a sample auction description.",
    bid_end_date: "2025-06-30",
  };

  const dummyQuotes = [
    {
      bid_id: "1",
      company_name: "Company A",
      bid_amount: 1000,
      commercial_offer: "offerA.pdf",
    },
    {
      bid_id: "2",
      company_name: "Company B",
      bid_amount: 1200,
      commercial_offer: "offerB.pdf",
    },
  ];

  const handleEditTenderChange = (field, value) => {
    setEditTender((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingIndicator />}

      <Text style={styles.title}>Auction Information</Text>

      {/* Tender Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Auction ID: {dummyTender.auction_id}
        </Text>
        <Text style={styles.cardText}>Title: {dummyTender.title}</Text>
        <Text style={styles.cardText}>Type: {dummyTender.auction_type}</Text>
        <Text style={styles.cardText}>
          Description: {dummyTender.description}
        </Text>
        <Text style={styles.cardText}>
          Deadline: {dummyTender.bid_end_date}
        </Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Editing Tender */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Tender</Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={editTender.title}
              onChangeText={(text) => handleEditTenderChange("title", text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              value={editTender.description}
              onChangeText={(text) =>
                handleEditTenderChange("description", text)
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Deadline"
              value={bidEndDate}
              onChangeText={(text) => setBidEndDate(text)}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalButtonPrimary}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Quotes */}
      <Text style={styles.subTitle}>Tender Quotes</Text>
      <FlatList
        data={dummyQuotes}
        keyExtractor={(item) => item.bid_id}
        renderItem={({ item, index }) => (
          <View style={styles.quoteRow}>
            <Text style={styles.quoteText}>
              {index + 1}. {item.company_name}
            </Text>
            <Text style={styles.quoteText}>Bid: {item.bid_amount}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.promotionButton}>
        <Text style={styles.promotionButtonText}>Promote Auction</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff7f00",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  button: {
    marginTop: 12,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  modalButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  modalButtonPrimary: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  quoteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#e9ecef",
    marginBottom: 4,
    borderRadius: 4,
  },
  quoteText: {
    fontSize: 14,
  },
  promotionButton: {
    backgroundColor: "orange",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  promotionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
