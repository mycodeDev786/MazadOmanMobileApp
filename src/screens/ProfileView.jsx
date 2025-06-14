import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

export default function ProfileView() {
  const [user, setUser] = useState({
    company_name: "My Company Ltd.",
    person_name: "John Doe",
    email: "john@example.com",
    phone_number: "+1234567890",
    created_at: new Date().toISOString(),
    logo: null,
    cr_file: null,
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCrLoaded, setIsCrLoaded] = useState(false);
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.canceled) {
      setFormData({ ...formData, logo: result.assets[0].uri });
    }
  };

  const pickCR = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (result.type === "success") {
      setFormData({ ...formData, cr_file: result.uri });
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setUser(formData);
      setIsEditing(false);
      setLoading(false);
    }, 1000);
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {loading && <ActivityIndicator style={styles.loading} size="large" />}

        <Text style={styles.header}>My Profile</Text>

        <View style={styles.profileCard}>
          <Image
            source={user.logo ? { uri: user.logo } : null}
            style={styles.avatar}
          />
          <View style={styles.infoGrid}>
            <Text style={styles.infoLabel}>Company:</Text>
            <Text style={styles.infoText}>{user.company_name}</Text>

            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoText}>{user.email}</Text>

            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoText}>{user.phone_number}</Text>

            <Text style={styles.infoLabel}>Joined On:</Text>
            <Text style={styles.infoText}>{formatDate(user.created_at)}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => setIsCrLoaded(true)}
            >
              <Text style={styles.btnText}>View CR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.btnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Edit Modal */}
        {isEditing && (
          <Modal visible transparent animationType="fade">
            <BlurView intensity={70} tint="dark" style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <ScrollView contentContainerStyle={styles.modalContent}>
                  <Text style={styles.modalHeader}>Edit Profile</Text>

                  <Text style={styles.label}>Company Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.company_name}
                    onChangeText={(text) =>
                      setFormData({ ...formData, company_name: text })
                    }
                  />

                  <Text style={styles.label}>Person Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.person_name}
                    onChangeText={(text) =>
                      setFormData({ ...formData, person_name: text })
                    }
                  />

                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.phone_number}
                    onChangeText={(text) =>
                      setFormData({ ...formData, phone_number: text })
                    }
                    keyboardType="phone-pad"
                  />

                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) =>
                      setFormData({ ...formData, email: text })
                    }
                    keyboardType="email-address"
                  />

                  <TouchableOpacity style={styles.uploadBtn} onPress={pickLogo}>
                    <Text style={styles.uploadBtnText}>
                      {formData.logo ? "Change Logo" : "Upload Logo"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.uploadBtn} onPress={pickCR}>
                    <Text style={styles.uploadBtnText}>
                      {formData.cr_file
                        ? "Change CR File"
                        : "Upload CR File (PDF)"}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.btn, styles.saveBtn]}
                      onPress={handleSave}
                    >
                      <Text style={styles.btnText}>Save Changes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btn, styles.cancelBtn]}
                      onPress={() => setIsEditing(false)}
                    >
                      <Text style={styles.btnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </BlurView>
          </Modal>
        )}

        {/* CR Viewer Modal */}
        {isCrLoaded && (
          <Modal visible transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalHeader}>CR Document</Text>
                {user.cr_file ? (
                  <Text style={styles.crText}>PDF Path: {user.cr_file}</Text>
                ) : (
                  <Text style={styles.crText}>No CR file uploaded</Text>
                )}
                <TouchableOpacity
                  style={[styles.btn, styles.cancelBtn]}
                  onPress={() => setIsCrLoaded(false)}
                >
                  <Text style={styles.btnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  loading: { marginVertical: 20 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
    alignSelf: "center",
    backgroundColor: "#eee",
  },
  infoGrid: { marginBottom: 20 },
  infoLabel: { fontSize: 14, color: "#555" },
  infoText: { fontSize: 16, fontWeight: "500", marginBottom: 10 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  btn: {
    backgroundColor: "orange",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  btnText: { textAlign: "center", color: "#fff", fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "90%",
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: { fontSize: 14, fontWeight: "600", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
  },
  uploadBtn: {
    backgroundColor: "#bbb",
    padding: 12,
    borderRadius: 6,
    marginTop: 15,
  },
  uploadBtnText: { textAlign: "center", color: "#fff" },
  saveBtn: { backgroundColor: "#4CAF50" },
  cancelBtn: { backgroundColor: "#777" },
  crText: { fontSize: 16, marginVertical: 20, textAlign: "center" },
});
