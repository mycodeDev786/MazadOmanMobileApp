import React from "react";
import { useSelector } from "react-redux";
import { View, StyleSheet } from "react-native";
import PromotionsList from "../components/PromotionsList"; // Ensure path is correct

export default function PromotionsPage() {
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <PromotionsList userId={userId} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    paddingHorizontal: 16,
    flex: 1,
  },
});
