// TenderDetailsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Linking,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useRoute } from "@react-navigation/native";

import { QuoteCard } from "../components/QuoteCard";

export default function TenderDetailsScreen() {
  const route = useRoute();
  const id = "T16902";

  const [tender, setTender] = useState(null);
  const [editTender, setEditTender] = useState({});
  const [quotes, setQuotes] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBidders, setSelectedBidders] = useState([]);

  useEffect(() => {
    const fetchTenderInformation = async () => {
      try {
        const response = await fetch(
          `https://mazadoman.com/backend/api/tenders/${id}`
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to fetch tender");
        }

        const data = await response.json();
        setTender(data.tender);
        setEditTender(data.tender);
        setExistingFiles(data.tender.additional_files || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchQuotes = async () => {
      try {
        const response = await fetch(
          `https://mazadoman.com/backend/api/quotes/tender/${id}`
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to fetch quotes");
        }

        const data = await response.json();
        setQuotes(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTenderInformation();
    fetchQuotes();
  }, [id]);

  const handleUpdateStatus = async (quoteId) => {
    // Find the quote with the matching ID
    const updatedQuote = quotes.find((q) => q.quote_id === quoteId);

    if (!updatedQuote) {
      console.warn("Quote not found");
      return;
    }

    try {
      const response = await fetch(
        `https://your-api.com/quotes/${quoteId}/status`,
        {
          method: "PUT", // or POST depending on your API
          headers: {
            "Content-Type": "application/json",
            // Add authorization headers if needed
          },
          body: JSON.stringify({ status: updatedQuote.quote_status }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Status updated successfully", data);
        // Optionally show a toast or update UI feedback
      } else {
        console.error("Failed to update status:", data.message || data);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleChange = (field, value) => {
    setEditTender({ ...editTender, [field]: value });
  };

  const openFilePicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.type === "success") {
      setSelectedFile(result);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tender Information</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tender ID: {tender?.tender_id}</Text>
        <Text>Title: {tender?.title}</Text>
        <Text>Description: {tender?.description}</Text>
        <Text style={styles.deadline}>Deadline: {tender?.bid_end_date}</Text>

        <TouchableOpacity style={styles.button} onPress={() => setIsOpen(true)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      {quotes.length === 0 ? (
        <Text style={styles.noQuotesText}>Quote not found</Text>
      ) : (
        quotes.map((comp) => (
          <QuoteCard
            key={comp.quote_id}
            comp={comp}
            selectedBidders={selectedBidders}
            setSelectedBidders={setSelectedBidders}
            setQuotes={setQuotes}
            handleUpdateStatus={handleUpdateStatus}
          />
        ))
      )}

      {/* Modal */}
      <Modal visible={isOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Tender Info</Text>

            <Text>Title</Text>
            <TextInput
              style={styles.input}
              value={editTender?.title}
              onChangeText={(val) => handleChange("title", val)}
            />

            <Text>Description</Text>
            <TextInput
              style={styles.textarea}
              value={editTender?.description}
              multiline
              onChangeText={(val) => handleChange("description", val)}
            />

            <Text>Deadline</Text>
            <TextInput
              style={styles.input}
              value={editTender?.bid_end_date}
              onChangeText={(val) => handleChange("bid_end_date", val)}
              placeholder="YYYY-MM-DD"
            />

            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={openFilePicker}
            >
              <Text style={styles.buttonText}>Edit Scope of Work</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsOpen(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={() => {
                  // Submit edit logic here
                  setIsOpen(false);
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deadline: {
    marginTop: 8,
    color: "red",
  },
  notFound: {
    color: "gray",
    fontStyle: "italic",
    marginVertical: 10,
  },
  quoteCard: {
    backgroundColor: "#e6f2ff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 8,
    borderRadius: 5,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    height: 100,
    textAlignVertical: "top",
    marginVertical: 8,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    flex: 1,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: "#28a745",
    flex: 1,
    marginLeft: 5,
  },
});
