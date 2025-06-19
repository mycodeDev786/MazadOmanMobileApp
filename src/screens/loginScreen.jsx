import React, { useState } from "react";
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
  SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import LoadingIndicator from "../components/LoadingIndicator";
import Toast from "react-native-toast-message";

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const data = { email, password };

    setLoading(true);

    try {
      const response = await fetch("https://mazadoman.com/backend/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Success: Save session
        dispatch(setUser({ user: result.user, token: result.token }));
        await AsyncStorage.setItem("authToken", result.token);
        await AsyncStorage.setItem("user", JSON.stringify(result.user));
        Toast.show({
          type: "success",
          text1: "Login successful",
        });

        navigation.navigate("Main"); // or "Dashboard", depending on your stack
      } else {
        Toast.show({
          type: "error",
          text1: result.message || "Login failed",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const isRTL = I18nManager.isRTL;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      {loading && <LoadingIndicator />}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[styles.container, { direction: isRTL ? "rtl" : "ltr" }]}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/icon.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Login Form Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{t("login.loginButton")}</Text>

              {/* Email */}
              <Text style={[styles.label]}>{t("login.emailLabel")}</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    textAlign: isRTL ? "right" : "left",
                    writingDirection: isRTL ? "rtl" : "ltr",
                  },
                ]}
                placeholder={t("login.emailPlaceholder")}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              {/* Password */}
              <Text style={[styles.label]}>{t("login.passwordLabel")}</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    textAlign: isRTL ? "right" : "left",
                    writingDirection: isRTL ? "rtl" : "ltr",
                  },
                ]}
                placeholder={t("login.passwordPlaceholder")}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              {/* Forgot Password */}
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={[styles.forgotPasswordText]}>
                  {t("login.forgotPassword")}
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>
                  {t("login.loginButton")}
                </Text>
              </TouchableOpacity>

              {/* Register Redirect */}
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerText}>
                  {t("login.noAccount")}{" "}
                  <Text style={styles.registerLink}>{t("login.register")}</Text>
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
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
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
    marginBottom: 40,
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
    backgroundColor: "#fafafa",
  },
  forgotPasswordText: {
    color: "#007AFF",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#ed8936",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerText: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  registerLink: {
    color: "#007AFF",
    fontWeight: "500",
  },
});
