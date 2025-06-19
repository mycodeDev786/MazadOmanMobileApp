import React, { useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";

const PaymentScreen = () => {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

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

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="blue" />}
      {!paymentUrl && !loading && (
        <Button title="Pay Now" onPress={handleSubmit} color="blue" />
      )}
      {paymentUrl && (
        <WebView
          source={{ uri: paymentUrl }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          originWhitelist={["*"]}
          onNavigationStateChange={(navState) => {
            // You can detect success/failure/cancel via URL redirect logic here
            console.log("Navigated to:", navState.url);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PaymentScreen;
