import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Linking,
  StyleSheet,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useSelector } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";

// screen to show detail of tender by id

const TenderDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;

  const [tender, setTender] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [technicalOffer, setTechnicalOffer] = useState(null);
  const [commercialOffer, setCommercialOffer] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [totalOffer, setTotalOffer] = useState("");
  const isLoggedIn = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!id) return;

    const fetchTenderDetails = async () => {
      setTender(null);
      setLoading(true);
      try {
        const res = await fetch(
          `https://mazadoman.com/backend/api/tenders/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch tender details");
        const data = await res.json();
        setTender(data.tender);
      } catch (err) {
        setError("Unable to fetch tender details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenderDetails();
  }, [id]);

  const pickDocument = async (setter, multiple = false) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      multiple,
    });
    if (!result.canceled) {
      if (multiple) {
        setter((prev) => [...prev, ...result.assets]);
      } else {
        setter(result.assets[0]);
      }
    }
  };

  const handleSubmit = () => {
    // Simulated submission
    alert("Offer submitted!");
  };

  return (
    <>
      {loading && <LoadingIndicator />}
      <ScrollView style={{ padding: 20, backgroundColor: "#f8f9fa" }}>
        <Image
          source={{ uri: `https://mazadoman.com/backend/${tender?.image}` }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 10,
            marginBottom: 20,
          }}
          resizeMode="cover"
        />

        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#800080",
            marginBottom: 10,
          }}
        >
          {tender?.title}
        </Text>

        <Text>
          <Text style={{ fontWeight: "bold" }}>Company:</Text>{" "}
          {tender?.company_name}
        </Text>
        <Text style={{ marginTop: 8 }}>
          <Text style={{ fontWeight: "bold" }}>Description:</Text>{" "}
          {tender?.description}
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Budget:</Text> {tender?.budget}{" "}
          {tender?.currency}
        </Text>
        <Text style={{ color: "red" }}>
          <Text style={{ fontWeight: "bold" }}>Deadline:</Text>{" "}
          {tender?.deadline}
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Created At:</Text>{" "}
          {tender?.created_at}
        </Text>

        <View style={{ marginVertical: 20 }}>
          <Button
            color={"#ed8936"}
            title="Download BOQ"
            onPress={() =>
              Linking.openURL("https://mazadoman.com/backend/" + tender?.boq)
            }
          />
          <View style={{ marginTop: 10 }}>
            <Button
              color={"#ed8936"}
              title="View BOQ"
              onPress={() =>
                Linking.openURL("https://mazadoman.com/backend/" + tender?.boq)
              }
            />
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Button
            color={"#ed8936"}
            title="Download Scope"
            onPress={() =>
              Linking.openURL("https://mazadoman.com/backend/" + tender?.scope)
            }
          />
          <View style={{ marginTop: 10 }}>
            <Button
              color={"#ed8936"}
              title="View Scope"
              onPress={() =>
                Linking.openURL(
                  "https://mazadoman.com/backend/" + tender?.scope
                )
              }
            />
          </View>
        </View>

        {tender?.additional_files.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              Additional Files
            </Text>
            {tender?.additional_files.map((file, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text>📄 File {index + 1}</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Button
                    color={"#ed8936"}
                    title="Download"
                    onPress={() => alert("Download " + file.file_path)}
                  />
                  <Button
                    color={"#ed8936"}
                    title="View"
                    onPress={() => alert("View " + file.file_path)}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {!isLoggedIn ? (
          <View
            style={{ alignItems: "center", marginTop: 30, marginBottom: 50 }}
          >
            <Text style={{ marginVertical: 20, fontSize: 15 }}>
              Please log in to submit an offer.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginBottom: 50 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}
            >
              Submit Offer
            </Text>

            <Text>Total Offer (USD):</Text>
            <TextInput
              value={totalOffer}
              onChangeText={setTotalOffer}
              keyboardType="numeric"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 6,
                padding: 10,
                marginBottom: 10,
                backgroundColor: "#fff",
              }}
            />

            <TouchableOpacity
              onPress={() => pickDocument(setTechnicalOffer)}
              style={{
                borderWidth: 1,
                padding: 10,
                borderRadius: 6,
                backgroundColor: "#eee",
                marginBottom: 10,
              }}
            >
              <Text>
                {technicalOffer
                  ? technicalOffer.name
                  : "Upload Technical Offer (PDF)"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => pickDocument(setCommercialOffer)}
              style={{
                borderWidth: 1,
                padding: 10,
                borderRadius: 6,
                backgroundColor: "#eee",
                marginBottom: 10,
              }}
            >
              <Text>
                {commercialOffer
                  ? commercialOffer.name
                  : "Upload Commercial Offer (PDF)"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => pickDocument(setAdditionalFiles, true)}
              style={{
                borderWidth: 1,
                padding: 10,
                borderRadius: 6,
                backgroundColor: "#eee",
                marginBottom: 10,
              }}
            >
              <Text>
                Upload Additional Documents ({additionalFiles.length} selected)
              </Text>
            </TouchableOpacity>

            {additionalFiles.length > 0 && (
              <FlatList
                data={additionalFiles}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text>📎 {item.name}</Text>}
              />
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit Offer</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
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
});
export default TenderDetailScreen;
