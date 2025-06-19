import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import Toast from "react-native-toast-message";

const PromotionScreen = ({ route }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const paymentSavedRef = useRef(false);

  const { id, type, user } = route.params || {};

  const plans = [
    {
      id: 1,
      title: "Free Plan",
      price: "0.5",
      duration: 3,
      description: "Free plan for 3 days.",
    },
    {
      id: 2,
      title: "Basic Plan",
      price: "5",
      duration: 7,
      description: "Basic plan for 7 days.",
    },
    {
      id: 3,
      title: "Standard Plan",
      price: "10",
      duration: 15,
      description: "Standard plan for 15 days.",
    },
    {
      id: 4,
      title: "Premium Plan",
      price: "20",
      duration: 30,
      description: "Premium plan for 30 days.",
    },
  ];

  const savePaymentData = async (formData, transactionId) => {
    try {
      await fetch("https://mazadoman.com/backend/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.api_token}`,
        },
        body: JSON.stringify(formData),
      });
      savedata(transactionId);
    } catch (err) {
      console.error("Payment save error:", err);
    }
  };

  const savedata = async (transactionId) => {
    const plan = plans.find((p) => p.id === selectedPlan);
    const formData = {
      user_id: user.id,
      target_type: type.toLowerCase(),
      target_id: id,
      duration_days: plan.duration,
      payment_reference: transactionId,
    };

    try {
      const res = await fetch(
        "https://mazadoman.com/backend/api/promotions/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.api_token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (res.ok) Toast.show({ type: "success", text1: "Promotion Activated" });
    } catch (err) {
      console.error("Promo creation error:", err);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    const plan = plans.find((p) => p.id === selectedPlan);
    const trxDateTime = new Date().toISOString();

    try {
      const response = await fetch(
        "https://mazadoman.com/backend/api/generate-secure-hash",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            MerchantId: "119134",
            TerminalId: "651609",
            Amount: plan.price,
            MerchantReference: String(plan.id),
            RequestDateTime: trxDateTime,
            CurrencyId: "512",
            SessionToken: "",
          }),
        }
      );

      const data = await response.json();

      const hash = data.SecureHash;
      console.log(hash);
      const url = `https://checkout.amwalpg.com/add-payment/?MID=119134&TID=651609&Amount=${plan.price}&Currency=512&MerchantReference=${plan.id}&Language=en&SecureHash=${hash}&RequestDateTime=${trxDateTime}&PaymentViewType=1&SessionToken=`;
      setPaymentUrl(url);
    } catch (err) {
      console.error("Hash error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      const transactionId = data?.data?.data?.hostResponseData?.transactionId;

      if (transactionId && !paymentSavedRef.current) {
        const plan = plans.find((p) => p.id === selectedPlan);
        const paymentData = {
          user_id: user?.id,
          amount: plan.price,
          currency: "OMR",
          payment_method: "Amwal Pay",
          payment_type: "promotion",
          status: "completed",
          description: plan.description,
          payment_reference: transactionId,
        };
        savePaymentData(paymentData, transactionId);
        paymentSavedRef.current = true;
      }
    } catch (err) {
      console.error("WebView message error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Toast />
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loading}
        />
      )}
      {paymentUrl ? (
        <WebView
          source={{ uri: paymentUrl }}
          onMessage={onWebViewMessage}
          style={styles.webview}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Promote Your Listing</Text>
          <Text style={styles.subtitle}>Select a promotion plan</Text>
          {plans.map((plan) => (
            <View
              key={plan.id}
              style={[
                styles.card,
                selectedPlan === plan.id && styles.selectedCard,
              ]}
            >
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text>{plan.description}</Text>
              <Text style={styles.price}>{plan.price} OMR</Text>
              <Text style={styles.duration}>{plan.duration} days</Text>
              <TouchableOpacity
                onPress={
                  selectedPlan === plan.id
                    ? handlePayment
                    : () => setSelectedPlan(plan.id)
                }
                style={
                  selectedPlan === plan.id ? styles.payBtn : styles.selectBtn
                }
              >
                <Text style={styles.btnText}>
                  {selectedPlan === plan.id ? "Pay Now" : "Select Plan"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default PromotionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: "#4f46e5",
    borderWidth: 2,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  price: {
    fontSize: 20,
    color: "#4f46e5",
    fontWeight: "bold",
    marginTop: 10,
  },
  duration: {
    color: "#6b7280",
  },
  selectBtn: {
    backgroundColor: "#f97316",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  payBtn: {
    backgroundColor: "#16a34a",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -25,
    marginTop: -25,
  },
  webview: {
    flex: 1,
    height: Dimensions.get("window").height,
  },
});
