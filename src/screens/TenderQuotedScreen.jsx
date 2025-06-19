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
import { useSelector } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";

export default function TenderQuotedScreen({ navigation }) {
  const [quotedTenders, setQuotedTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setError("User ID is required");
      setLoading(false);
      return;
    }

    // Fetch tenders by user ID
    fetch(`https://mazadoman.com/backend/api/quotes/all/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tenders.");
        }
        return response.json();
      })
      .then((data) => {
        setQuotedTenders(data.data); // Assuming the response has a 'tenders' array
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  const handlePress = (tenderId) => {
    navigation.navigate("TenderQuotedDetail", { id: tenderId });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <LoadingIndicator />
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
          numColumns={1}
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
    marginVertical: 6,
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
