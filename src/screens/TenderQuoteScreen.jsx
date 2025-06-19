import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingIndicator from "../components/LoadingIndicator";

export default function TenderScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};
  const user = useSelector((state) => state.auth.user);

  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [technicalOffer, setTechnicalOffer] = useState(null);
  const [commercialOffer, setCommercialOffer] = useState(null);
  const [totalOffer, setTotalOffer] = useState("");

  useEffect(() => {
    const fetchTenderInformation = async () => {
      try {
        const response = await fetch(
          `https://mazadoman.com/backend/api/quotes/show/${id}/${user?.id}`
        );
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to fetch tender");
        }

        const data = await response.json();
        setTender(data.data);
        setTotalOffer(data.data.quote_amount?.toString() || "");
      } catch (err) {
        setError(err.message);
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTenderInformation();
  }, [id]);

  const isBiddingBooked =
    tender?.status && tender?.status.toLowerCase().includes("approve");

  const handlePickFile = async (type) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      if (type === "technical") setTechnicalOffer(file);
      else if (type === "commercial") setCommercialOffer(file);
      else setAdditionalFiles((prev) => [...prev, file]);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("quote_amount", totalOffer);
      if (technicalOffer) {
        formData.append("technical_offer", {
          uri: technicalOffer.uri,
          name: technicalOffer.name,
          type: "application/pdf",
        });
      }
      if (commercialOffer) {
        formData.append("commercial_offer", {
          uri: commercialOffer.uri,
          name: commercialOffer.name,
          type: "application/pdf",
        });
      }

      additionalFiles.forEach((file, index) => {
        formData.append(`additional_files[${index}]`, {
          uri: file.uri,
          name: file.name,
          type: "application/pdf",
        });
      });

      const response = await fetch(
        `https://mazadoman.com/backend/api/quotes/update/${tender?.quote_id}`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Submission failed");

      Alert.alert("Success", "Quote updated successfully");
      setShowEditModal(false);
      setShowResubmitModal(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tender Quotation Details</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Tender ID:</Text>
          <Text style={styles.value}>{tender?.tender_id}</Text>

          <Text style={styles.label}>Title:</Text>
          <Text style={styles.value}>{tender?.tender_title}</Text>

          <Text style={styles.label}>Quoted Amount:</Text>
          <Text style={styles.value}>{tender?.quote_amount} OMR</Text>

          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{tender?.status}</Text>

          <Text style={styles.label}>Bidding Date:</Text>
          <Text style={styles.value}>{tender?.biddingDate}</Text>
        </View>

        <TouchableOpacity
          style={styles.buttonYellow}
          onPress={() => setShowEditModal(true)}
        >
          <Text style={styles.buttonText}>✏️ Edit Quotation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonGreen}
          onPress={() => setShowResubmitModal(true)}
        >
          <Text style={styles.buttonText}>📤 Resubmit Quotation</Text>
        </TouchableOpacity>

        {isBiddingBooked && (
          <TouchableOpacity style={styles.buttonBlue}>
            <Text style={styles.buttonText}>Enter Online Bidding</Text>
          </TouchableOpacity>
        )}

        {renderModal()}
      </ScrollView>
    </SafeAreaView>
  );

  function renderModal() {
    return (
      <Modal
        visible={showEditModal || showResubmitModal}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {showEditModal ? "Edit Quotation" : "Resubmit Quotation"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Quoted Amount (OMR)"
              value={totalOffer}
              onChangeText={setTotalOffer}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.fileButton}
              onPress={() => handlePickFile("technical")}
            >
              <Text>
                📄 {technicalOffer?.name || "Select Technical Offer (PDF)"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fileButton}
              onPress={() => handlePickFile("commercial")}
            >
              <Text>
                📄 {commercialOffer?.name || "Select Commercial Offer (PDF)"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fileButton}
              onPress={() => handlePickFile("additional")}
            >
              <Text>📄 Add Additional Files (PDF)</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowEditModal(false);
                  setShowResubmitModal(false);
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={{ color: "white" }}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    color: "orange",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  infoBox: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
  },
  label: {
    color: "#555",
    fontWeight: "bold",
  },
  value: {
    marginBottom: 10,
    color: "#333",
  },
  buttonYellow: {
    backgroundColor: "#f1c40f",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonGreen: {
    backgroundColor: "#27ae60",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonBlue: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
  },
  fileButton: {
    backgroundColor: "#eee",
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 6,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
