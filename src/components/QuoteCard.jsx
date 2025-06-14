import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export const QuoteCard = ({
  comp,
  selectedBidders,
  setSelectedBidders,
  setQuotes,
  handleUpdateStatus,
}) => {
  const isSelected = selectedBidders.includes(comp.user_id);

  const toggleSelection = () => {
    setSelectedBidders((prev) =>
      isSelected
        ? prev.filter((id) => id !== comp.user_id)
        : [...prev, comp.user_id]
    );
  };

  const updateStatus = (status) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.quote_id === comp.quote_id ? { ...q, quote_status: status } : q
      )
    );
  };

  return (
    <View style={quoteCardStyles.card}>
      <View style={quoteCardStyles.header}>
        <TouchableOpacity onPress={toggleSelection}>
          <Text style={quoteCardStyles.checkbox}>
            {isSelected ? "☑️" : "⬜️"}
          </Text>
        </TouchableOpacity>

        <Text style={quoteCardStyles.title}>{comp.company_name}</Text>
      </View>

      <View style={quoteCardStyles.infoRow}>
        <Text style={quoteCardStyles.label}>Quote Amount:</Text>
        <Text style={quoteCardStyles.value}>{comp.quote_amount} OMR</Text>
      </View>

      <View style={quoteCardStyles.infoRow}>
        <Text style={quoteCardStyles.label}>Submitted by:</Text>
        <Text style={quoteCardStyles.value}>
          {comp.contact_person || "N/A"}
        </Text>
      </View>

      <View style={quoteCardStyles.infoRow}>
        <Text style={quoteCardStyles.label}>Email:</Text>
        <Text style={quoteCardStyles.value}>{comp.contact_email || "N/A"}</Text>
      </View>

      <View style={quoteCardStyles.linksContainer}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              `https://mazadoman.com/backend/${comp.technical_offer}`
            )
          }
        >
          <Text style={[quoteCardStyles.link, { color: "green" }]}>
            Technical Document
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              `https://mazadoman.com/backend/${comp.commercial_offer}`
            )
          }
        >
          <Text style={[quoteCardStyles.link, { color: "red" }]}>
            Commercial Document
          </Text>
        </TouchableOpacity>
      </View>

      <View style={quoteCardStyles.row}>
        <Picker
          selectedValue={comp.quote_status}
          style={quoteCardStyles.picker}
          onValueChange={updateStatus}
        >
          <Picker.Item label="Select Option" value="" />
          <Picker.Item label="Approve" value="approve" />
          <Picker.Item label="Reject" value="reject" />
          <Picker.Item
            label="Submit Technical Offer"
            value="Submit technical offer"
          />
          <Picker.Item
            label="Resubmit Commercial Offer"
            value="resubmit the commercial offer."
          />
          <Picker.Item label="Postpone" value="postpond" />
          <Picker.Item label="Tender Canceled" value="tender canceled" />
          <Picker.Item label="Cancelled" value="Cancelled" />
          <Picker.Item label="Award the Job" value="Award the job" />
        </Picker>

        <TouchableOpacity
          onPress={() => handleUpdateStatus(comp.quote_id)}
          style={quoteCardStyles.updateButton}
        >
          <Text style={quoteCardStyles.updateText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const quoteCardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkbox: {
    fontSize: 18,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 14,
    color: "#111",
    fontWeight: "500",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  link: {
    fontSize: 13,
    textDecorationLine: "underline",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    marginRight: 12,
  },
  updateButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  updateText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
