import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  I18nManager,
  Alert,
  SafeAreaView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { MultiSelect } from "react-native-element-dropdown";
import categories from "../constants/categories";

export default function RegisterScreen({ navigation }) {
  const { t } = useTranslation();
  const [companyName, setCompanyName] = useState("");
  const [personName, setPersonName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [crFile, setCrFile] = useState(null);

  const language = "ar";

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  const categoryOptions = categories.map((cat) => ({
    label: cat.title[language],
    value: cat.id,
  }));

  const subcategoryOptions = categories.flatMap((cat) =>
    cat.subcategories.map((sub) => ({
      label: `${cat.title[language]} - ${sub.title[language]}`,
      value: sub.id,
    }))
  );

  const isRTL = I18nManager.isRTL;

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert(t("register.passwordMismatch"));
      return;
    }

    console.log("Registering:", {
      companyName,
      personName,
      phone,
      email,
      password,
      companyLogo,
      crFile,
    });

    navigation.navigate("Login");
  };

  const pickDocument = async (setter) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (result?.assets?.length > 0 && result.assets[0].uri) {
        setter(result.assets[0]);
      }
    } catch (error) {
      console.error("File picking failed", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View
            style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/icon.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {t("register.title") || "Register"}
              </Text>

              {/* Company Name */}
              <Text
                style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}
              >
                {t("register.companyName")}
              </Text>
              <TextInput
                style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
                value={companyName}
                onChangeText={setCompanyName}
                placeholder={t("register.companyNamePlaceholder")}
              />

              {/* Company Logo Upload */}
              {/* Company Name */}
              <Text
                style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}
              >
                {t("register.companyLogo")}
              </Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickDocument(setCompanyLogo)}
              >
                <Text style={styles.uploadButtonText}>
                  {companyLogo
                    ? t("register.logoSelected") || "Logo Selected"
                    : t("register.noFileChosen") || "Upload Company Logo"}
                </Text>
              </TouchableOpacity>

              {/* CR File Upload */}
              {/* Company Name */}
              <Text
                style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}
              >
                {t("register.uploadCR")}
              </Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => pickDocument(setCrFile)}
              >
                <Text style={styles.uploadButtonText}>
                  {crFile
                    ? t("register.crSelected") || "CR File Selected"
                    : t("register.noFileChosen") || "Upload CR File"}
                </Text>
              </TouchableOpacity>

              {/* Person Name */}
              <Text
                style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}
              >
                {t("register.personName")}
              </Text>
              <TextInput
                style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
                value={personName}
                onChangeText={setPersonName}
                placeholder={t("register.personName")}
              />

              {/* Phone */}
              <Text
                style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}
              >
                {t("register.phoneNumber")}
              </Text>
              <TextInput
                style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder={t("register.phoneNumber")}
              />

              {/* Email */}
              <Text
                style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}
              >
                {t("register.emailAddress")}
              </Text>
              <TextInput
                style={[styles.input, { textAlign: isRTL ? "right" : "left" }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder={t("register.emailAddress")}
                autoCapitalize="none"
              />
              <View style={{ paddingVertical: 10 }}>
                <Text style={styles.label}>
                  {t("register.selectCategories")}{" "}
                  <Text style={{ color: "orange" }}>*</Text>
                </Text>
                <MultiSelect
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,

                    marginBottom: 10,
                    paddingHorizontal: 2,
                    paddingVertical: 8,
                  }}
                  data={categoryOptions}
                  labelField="label"
                  valueField="value"
                  placeholder={
                    language === "en" ? "Select categories" : "اختر فئة"
                  }
                  value={selectedCategories}
                  onChange={(item) => setSelectedCategories(item)}
                  selectedStyle={{ borderRadius: 12 }}
                />

                <Text style={styles.label}>
                  {t("register.selectSubcategories")}{" "}
                  <Text style={{ color: "orange" }}>*</Text>
                </Text>
                <MultiSelect
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    paddingHorizontal: 2,
                    paddingVertical: 8,
                  }}
                  data={subcategoryOptions}
                  labelField="label"
                  valueField="value"
                  placeholder={
                    language === "en"
                      ? "Select subcategories"
                      : "اختر فئة فرعية"
                  }
                  value={selectedSubcategories}
                  onChange={(item) => setSelectedSubcategories(item)}
                  selectedStyle={{ borderRadius: 12 }}
                />
              </View>

              {/* Password */}
              <Text
                style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}
              >
                {t("register.password")}
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t("register.passwordPlaceholder")}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={22}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <Text
                style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}
              >
                {t("register.confirmPassword")}
              </Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={t("register.confirmPasswordPlaceholder")}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye" : "eye-off"}
                    size={22}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
              >
                <Text style={styles.registerButtonText}>
                  {t("register.registerButton")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginRedirectText}>
                  {t("register.alreadyAccount")}{" "}
                  <Text style={styles.loginLink}>{t("register.login")}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 2,
  },
  logo: {
    width: 150,
    height: 150,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 40,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ed8936",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 15,
    color: "#555",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: "#f5f5f5",
  },
  passwordContainer: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  registerButton: {
    backgroundColor: "#ed8936",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginRedirectText: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  loginLink: {
    color: "#007AFF",
    fontWeight: "500",
  },
  uploadButton: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  uploadButtonText: {
    fontSize: 14,
    color: "#555",
    paddingHorizontal: 2,
  },
});
