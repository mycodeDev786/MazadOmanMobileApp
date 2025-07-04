import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import * as Updates from "expo-updates";
import { I18nManager } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfilePage = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out of your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              dispatch(logout());
              await AsyncStorage.multiRemove(["authToken", "user"]);
              navigation.replace("Login");
            } catch (error) {
              console.error("Logout failed:", error);
            }
          },
        },
      ]
    );
  };

  const changeLanguage = async (lng) => {
    const isRTL = lng === "ar";

    if (I18nManager.isRTL !== isRTL) {
      await i18n.changeLanguage(lng);
      I18nManager.forceRTL(isRTL);
      Alert.alert(t("login.restartTitle"), t("login.restartMessage"), [
        {
          text: t("login.ok"),
          onPress: async () => {
            await Updates.reloadAsync();
          },
        },
      ]);
    } else {
      await i18n.changeLanguage(lng);
    }
    setLanguageModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {user ? (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image
              source={{
                uri: "https://mazadoman.com/backend/uploads/tenders/1748586275_Untitled%20design%20(1).png",
              }}
              style={styles.profilePic}
            />
            <Text style={styles.userName}>{user.name || "User"}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <ProfileButton
              icon="person-outline"
              label="View Profile"
              onPress={() => navigation.navigate("ProfileView")}
            />
            <ProfileButton
              icon="grid-outline"
              label="Dashboard"
              onPress={() => navigation.navigate("Dashboard")}
            />
            <ProfileButton
              icon="pricetag-outline"
              label="Promoted Product"
              onPress={() => navigation.navigate("PromotedProduct")}
            />
            <ProfileButton
              icon="language-outline"
              label="Language"
              onPress={() => setLanguageModalVisible(true)}
            />
            <ProfileButton
              icon="log-out-outline"
              label="Logout"
              onPress={handleLogout}
            />
          </View>
        </ScrollView>
      ) : (
        // 🔒 Unauthenticated layout
        <View style={styles.loginContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.replace("Login")}
          >
            <Text style={styles.loginButtonText}>Login / Signup</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Language Modal - keep this outside so it's available in both modes */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => changeLanguage("en")}
            >
              <View style={styles.languageRow}>
                <Image
                  source={{ uri: "https://flagcdn.com/w40/us.png" }}
                  style={styles.flag}
                />
                <Text style={styles.languageText}>English</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => changeLanguage("ar")}
            >
              <View style={styles.languageRow}>
                <Image
                  source={{ uri: "https://flagcdn.com/w40/om.png" }}
                  style={styles.flag}
                />
                <Text style={styles.languageText}>العربية</Text>
              </View>
            </TouchableOpacity>

            <Pressable onPress={() => setLanguageModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Reusable Button Component
const ProfileButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <View style={styles.iconLabel}>
      <Icon name={icon} size={22} color="#FF7E00" style={{ marginRight: 10 }} />
      <Text style={styles.buttonText}>{label}</Text>
    </View>
    <Icon name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FF7E00",
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  buttonContainer: {
    gap: 15,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: "#FF7E00",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  iconLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  languageOption: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  languageText: {
    fontSize: 16,
  },
  cancelText: {
    color: "#FF7E00",
    marginTop: 15,
    fontSize: 16,
  },
  languageRow: {
    flexDirection: "row",
    width: "40%",

    alignItems: "center", // vertical center
    gap: 10, // or use marginLeft in Text
  },
  flag: {
    width: 24,
    height: 16,
    resizeMode: "contain",
  },
  languageText: {
    fontSize: 16,
    color: "#333",
  },
});

export default ProfilePage;
