import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import categories from "../constants/categories";
import { WebView } from "react-native-webview";
import LoadingIndicator from "../components/LoadingIndicator";

const screenHeight = Dimensions.get("window").height;

const CreateAuctionScreen = ({ navigation }) => {
  const [auctionType, setAuctionType] = useState(null);
  const [tenderName, setTenderName] = useState(null);
  const [description, setDescription] = useState(null);
  const [budget, setBudget] = useState(null);
  const [bidStartDate, setBidStartDate] = useState(new Date());
  const [bidEndDate, setBidEndDate] = useState(new Date());
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [image, setImage] = useState(null);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [free_auctions_used, setFreeAuctionsUsed] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const language = "en";

  const user = useSelector((state) => state.auth.user);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://mazadoman.com/backend/api/companyuser/free-auctions-used",
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
        setFreeAuctionsUsed(result.free_auctions_used);
      } catch (err) {
        //setError(err.message);
      }
    };

    if (user.api_token) {
      fetchData();
    } else {
    }
  }, [user.api_token]);

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false); // Close the picker
    if (selectedDate) {
      setBidStartDate(selectedDate); // Update the date if selected
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false); // Close the picker
    if (selectedDate) {
      setBidEndDate(selectedDate); // Update the date if selected
    }
  };

  const handleFileChange = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "image/*" });
    if (result.type === "success") setImage(result);
  };

  const handleAdditionalFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/*",
      multiple: true,
    });
    if (result.type === "success") {
      setAdditionalFiles((prev) => [...prev, result]);
    }
  };

  const savePaymentData = async (formData, transactionId) => {
    try {
      const response = await fetch(
        "https://mazadoman.com/backend/api/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.api_token}`,
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Payment Saved");
        const fee = "paid";

        savedata(fee);
      } else {
        //setMessage(`❌ Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error(error);
      // setMessage("❌ Network error or server unreachable.");
    }
  };

  const savedata = async (payment_status) => {
    const formData = new FormData();

    formData.append("user_id", String(user?.id));
    formData.append("title", String(tenderName));
    formData.append("category", String(category));
    formData.append("subcategory", String(subcategory));
    formData.append("description", String(description));
    formData.append("budget", String(budget));
    formData.append("bid_start_date", String(bidStartDate));
    formData.append("bid_end_date", String(bidEndDate));
    formData.append("auction_type", String(auctionType));
    formData.append("payment_status", String(payment_status));

    if (image && image.uri) {
      formData.append("image", {
        uri: image.uri,
        name: image.name || "image.jpg",
        type: image.type || "image/jpeg",
      });
    }

    if (additionalFiles && additionalFiles.length > 0) {
      additionalFiles.forEach((file, index) => {
        formData.append(`additional_files[${index}]`, {
          uri: file.uri,
          name: file.name,
          type: file.type || "application/octet-stream",
        });
      });
    }

    try {
      console.log(user?.api_token);
      const response = await fetch(
        "https://mazadoman.com/backend/api/auctions/post",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.api_token}`,
            // Don't set Content-Type manually
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        toast.success("Auction posted successfully.");
      } else {
        const firstError = data?.errors
          ? Object.values(data.errors)[0][0]
          : "Something went wrong.";
        toast.error(firstError);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (
      tenderName &&
      description &&
      auctionType &&
      bidStartDate &&
      bidEndDate &&
      budget &&
      category &&
      subcategory
    ) {
      setIsLoading(true);
      if (auctionType === "Forward") {
        const fee = "paid";
        savedata(fee);
      } else if (auctionType === "Reverse" && free_auctions_used > 10) {
        console.log(free_auctions_used);
        // Do something for reverse auction if user has used free auctions
        try {
          setIsLoading(true);

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
          setIsLoading(false);
        }
      } else {
        const fee = "pending";
        savedata(fee);
      }
    } else {
      console.log("Please Enter all details");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading && <LoadingIndicator />}
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
              if (navState.url.includes("payment-success")) {
                // 👇 Payment success logic here
                console.log("Payment Successful!");
                // You can close the WebView, show success screen, etc.
              }

              if (navState.url.includes("payment-failure")) {
                // 👇 Payment failure logic here
                console.log("Payment Failed!");
              }
            }}
          />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Post an Auction</Text>
        <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}>
          Auction Title:
        </Text>
        <TextInput
          placeholder="Auction Name"
          value={tenderName}
          onChangeText={setTenderName}
          style={styles.input}
        />

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}>
            Auction Type:
          </Text>
          <View
            style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8 }}
          >
            <Picker
              selectedValue={auctionType}
              onValueChange={(value) => setAuctionType(value)}
              style={{ height: 50 }}
            >
              <Picker.Item
                label="Select Auction Type"
                value=""
                enabled={false}
              />
              <Picker.Item label="Forward" value="Forward" />
              <Picker.Item label="Reverse" value="Reverse" />
            </Picker>
          </View>
        </View>
        <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}>
          Auction Description:
        </Text>
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textarea]}
          multiline
        />
        <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 8 }}>
          Auction Budget:
        </Text>
        <TextInput
          placeholder="Budget"
          value={budget}
          onChangeText={setBudget}
          style={styles.input}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Bid Start Date:</Text>
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>
            {bidStartDate.toDateString()}
          </Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={bidStartDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleStartDateChange}
          />
        )}

        <Text style={styles.label}>Bid End Date:</Text>
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>{bidEndDate.toDateString()}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={bidEndDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleEndDateChange}
          />
        )}

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

        <TouchableOpacity onPress={handleFileChange} style={styles.button}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAdditionalFiles} style={styles.button}>
          <Text style={styles.buttonText}>Upload Additional Files</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#ed8936",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  datePickerText: {
    fontSize: 16,
    color: "#333",
  },
});

export default CreateAuctionScreen;
