import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import categories from "../constants/categories";

const screenWidth = Dimensions.get("window").width;

const CategoryPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id: categoryId, type: Type } = route.params || {};

  const [query, setQuery] = useState("");
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(false);
  const language = "en";
  function getSubcategoryTitleById(subcategoryId) {
    for (const category of categories) {
      const subcat = category.subcategories.find(
        (sc) => sc.id === subcategoryId
      );
      if (subcat) return subcat.title[language];
    }
    return null;
  }

  const categoryTitle = getSubcategoryTitleById(categoryId) || "All Tenders"; // Replace with actual logic if needed

  useEffect(() => {
    const fetchTenders = async () => {
      setLoading(true);
      try {
        const encodedCategory = encodeURIComponent(categoryId);
        const response = await fetch(
          `https://mazadoman.com/backend/api/tenders/category/${encodedCategory}`
        );
        const data = await response.json();
        setTenders(data.tenders || []);
      } catch (error) {
        console.error("Error fetching tenders:", error);
        setTenders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, [categoryId]);

  const filteredTenders = tenders.filter(
    (tender) =>
      tender?.title.toLowerCase().includes(query.toLowerCase()) ||
      tender?.tender_id.toLowerCase().includes(query.toLowerCase())
  );

  const renderTender = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("TenderDetails", {
          id: item?.tender_id,
        })
      }
    >
      <Image
        source={{ uri: `https://mazadoman.com/backend/${item?.image}` }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {item.tender_id}: {item.title}
        </Text>
        <Text style={styles.budget}>{item.budget} OMR</Text>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Submit Offer</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/hero.png")} style={styles.hero} />
      <View style={styles.overlay}>
        <Text style={styles.title}>{categoryTitle}</Text>
        <Text style={styles.description}>
          Explore official e-tender listings across Oman
        </Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by title or ID"
          placeholderTextColor="#ccc"
          style={styles.input}
        />
      </View>

      <Text style={styles.sectionHeader}>
        {Type === "Tenders"
          ? "All Tenders"
          : Type === "Forward Auction"
          ? "All Forward Auctions"
          : Type === "Reverse Auction"
          ? "All Reverse Auctions"
          : "All Listings"}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : filteredTenders.length > 0 ? (
        <FlatList
          data={filteredTenders}
          keyExtractor={(item) => item.tender_id}
          renderItem={renderTender}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noData}>No tenders found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  hero: {
    width: "100%",
    height: 250,
    position: "absolute",
    top: 0,
    left: 0,
  },
  overlay: {
    height: 250,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    maxWidth: 360,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
    color: "#333",
  },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 150,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5A189A",
  },
  budget: {
    color: "#444",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#FFA500",
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  noData: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
  },
});

export default CategoryPage;
