import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TenderQuotedScreen({ navigation }) {
  const [quotedTenders, setQuotedTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data simulating fetched tenders
  const dummyQuotedTenders = [
    { tender_id: "QTND001", tender_title: "Office Interior Design" },
    { tender_id: "QTND002", tender_title: "Security System Installation" },
    { tender_id: "QTND003", tender_title: "Software Development" },
    { tender_id: "QTND004", tender_title: "Vehicle Leasing Services" },
  ];

  useEffect(() => {
    // Simulate fetch delay
    const timer = setTimeout(() => {
      setQuotedTenders(dummyQuotedTenders);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handlePress = (tenderId) => {
    navigation.navigate("TenderQuotedDetail", { id: tenderId });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#C026D3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Tenders You've Quoted</Text>
        <FlatList
          data={quotedTenders}
          keyExtractor={(item) => item.tender_id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePress(item.tender_id)}
            >
              <Text style={styles.idText}>{item.tender_id}</Text>
              <Text style={styles.titleText}>{item.tender_title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#F97316",
    textAlign: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#D946EF", // Fuchsia shade
    flex: 1,
    marginRight: 8,
    padding: 16,
    borderRadius: 12,
    minHeight: 100,
    justifyContent: "center",
    elevation: 3,
  },
  idText: {
    fontSize: 12,
    color: "#fff",
    marginBottom: 4,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
