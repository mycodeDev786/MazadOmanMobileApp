import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import categories from "../constants/categories";
import { WebView } from "react-native-webview";
import { BlurView } from "expo-blur";
import { useSelector } from "react-redux";

const screenHeight = Dimensions.get("window").height;

const CreateTenderScreen = ({ navigation }) => {
  const [tenderName, setTenderName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [bidStartDate, setBidStartDate] = useState("");
  const [bidEndDate, setBidEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [image, setImage] = useState(null);
  const [scope, setScope] = useState(null);
  const [boq, setBoq] = useState(null);
  const [loading, setLoading] = useState(false);
  const language = "en";
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [free_tenders_used, setFreeTendersUsed] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://mazadoman.com/backend/api/companyuser/free-tenders-used",
          {
            headers: {
              Authorization: `Bearer ${user.api_token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setFreeTendersUsed(result.free_tenders_used);
      } catch (err) {
        //setError(err.message);
      }
    };

    if (user.api_token) {
      fetchData();
    } else {
    }
  }, [user?.api_token]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const pickDocument = async (setFile) => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.type === "success") {
      setFile(result);
    }
  };

  const submitForm = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", tenderName);
    formData.append("description", description);
    formData.append("budget", budget);
    formData.append("bid_start_date", bidStartDate);
    formData.append("bid_end_date", bidEndDate);
    formData.append("category_id", category);
    formData.append("subcategory_id", subcategory);
    if (image) {
      formData.append("image", {
        uri: image,
        name: "image.jpg",
        type: "image/jpeg",
      });
    }
    if (scope) {
      formData.append("scope", {
        uri: scope.uri,
        name: scope.name,
        type: scope.mimeType,
      });
    }
    if (boq) {
      formData.append("boq", {
        uri: boq.uri,
        name: boq.name,
        type: boq.mimeType,
      });
    }

    try {
      const response = await fetch(
        "https://your-api-endpoint.com/tenders/post",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer YOUR_API_TOKEN",
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Tender posted successfully!");
      } else {
        alert("Failed to post tender");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const trxDateTime = new Date().toISOString();

      const response = await fetch(
        "https://mazadoman.com/backend/api/generate-secure-hash",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            MerchantId: "119134",
            TerminalId: "651609",
            Amount: "10",
            MerchantReference: "1",
            RequestDateTime: trxDateTime,
            CurrencyId: "512",
            SessionToken: "",
          }),
        }
      );

      const data = await response.json();

      if (!data?.SecureHash) {
        throw new Error("SecureHash not returned");
      }

      // ✅ Use direct payment URL (not SmartBox embed)
      const url = `https://checkout.amwalpg.com/add-payment/?MID=119134&TID=651609&Amount=10&Currency=512&MerchantReference=1&Language=en&SecureHash=${encodeURIComponent(
        data.SecureHash
      )}&RequestDateTime=${encodeURIComponent(
        trxDateTime
      )}&PaymentViewType=1&SessionToken=`;

      setPaymentUrl(url);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Payment initialization failed.");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.title[language],
  }));

  const selectedCategoryObj = categories.find((cat) => cat.id === category);

  const subcategoryOptions = selectedCategoryObj
    ? selectedCategoryObj.subcategories.map((sub) => ({
        value: sub.id,
        label: sub.title[language],
      }))
    : [];

  return (
    <View style={{ flex: 1 }}>
      {paymentUrl && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: screenHeight, // 👈 Full screen height
            zIndex: 100,
          }}
        >
          <WebView
            source={{ uri: paymentUrl }}
            style={{ flex: 1 }} // 👈 Takes full height of parent
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            originWhitelist={["*"]}
            onNavigationStateChange={(navState) => {
              console.log("Navigated to:", navState.url);
            }}
          />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Post New Tender</Text>

        <TextInput
          style={styles.input}
          placeholder="Tender Name"
          value={tenderName}
          onChangeText={setTenderName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Budget"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Bid Start Date (YYYY-MM-DD)"
          value={bidStartDate}
          onChangeText={setBidStartDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Bid End Date (YYYY-MM-DD)"
          value={bidEndDate}
          onChangeText={setBidEndDate}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={(value) => {
              setCategory(value);
              setSubcategory("");
            }}
          >
            <Picker.Item label="Select category" value="" />
            {categoryOptions.map((cat) => (
              <Picker.Item
                key={cat.value}
                label={cat.label}
                value={cat.value}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Subcategory</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={subcategory}
            onValueChange={(value) => setSubcategory(value)}
            enabled={!!category}
          >
            <Picker.Item label="Select subcategory" value="" />
            {subcategoryOptions.map((sub) => (
              <Picker.Item
                key={sub.value}
                label={sub.label}
                value={sub.value}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => pickDocument(setScope)}
        >
          <Text style={styles.buttonText}>Upload Scope</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => pickDocument(setBoq)}
        >
          <Text style={styles.buttonText}>Upload BOQ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    color: "#ed8936",
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#555",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#ed8936",
    padding: 15,
    borderRadius: 6,
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CreateTenderScreen;
