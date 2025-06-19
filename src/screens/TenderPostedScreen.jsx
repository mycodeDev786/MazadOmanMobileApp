import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import LoadingIndicator from "../components/LoadingIndicator";

// All tender posted screen

export default function TenderPostedScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [tenders, setTenders] = useState([]);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setError("");
      setLoading(false);
      return;
    }

    fetch(`https://mazadoman.com/backend/api/user-tenders/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("");
        }
        return response.json();
      })
      .then((data) => {
        setTenders(data.tenders);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  const handlePress = (tenderId) => {
    navigation.navigate("TenderDetail", { id: tenderId });
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tenders Posted</Text>
      <FlatList
        data={tenders}
        keyExtractor={(item) => item.tender_id}
        numColumns={1}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(item.tender_id)}
          >
            <Text style={styles.idText}>ID: {item.tender_id}</Text>
            <Text style={styles.titleText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#f2f2f2",
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
    backgroundColor: "#D9F99D",
    flex: 1,
    marginRight: 8,
    padding: 16,
    borderRadius: 12,
    minHeight: 100,
    justifyContent: "center",
    elevation: 2,
    marginVertical: 8,
  },
  idText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
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
