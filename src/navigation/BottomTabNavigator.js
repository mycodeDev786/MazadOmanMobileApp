import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

// Screens

import ProfileStackNavigator from "../navigation/ProfileStackNavigator";
import HomeStackNavigator from "../navigation/HomeStackNavigator";
import ListingStackNavigator from "../navigation/ListingStackNavigator";
import Toast from "react-native-toast-message";
import OnlineBidding from "../screens/OnlineBiddingScreen";

const CenterText = ({ text }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>{text}</Text>
  </View>
);

const Tab = createBottomTabNavigator();

// Custom Tab Bar
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { t } = useTranslation();
  const centerButtonSize = 60;
  const user = useSelector((state) => state.auth.user);
  const [showActions, setShowActions] = React.useState(false);

  const handleActionPress = (action) => {
    setShowActions(false);
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Login Required",
        text2: "Please login to continue",
      });
      return;
    }

    if (action === "auction") {
      navigation.navigate("CreateAuction");
    } else if (action === "tender") {
      navigation.navigate("CreateTender");
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.tabBarContainer}>
      {/* Fan-out Buttons */}
      {showActions && (
        <>
          <TouchableOpacity
            onPress={() => handleActionPress("auction")}
            style={[styles.floatingCircleButton, { bottom: 80, left: "32%" }]}
          >
            <Icon name="hammer-outline" size={24} color="#fff" />
            <Text style={styles.floatingButtonLabel}>Auction</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleActionPress("tender")}
            style={[styles.floatingCircleButton, { bottom: 80, right: "32%" }]}
          >
            <Icon name="document-text-outline" size={24} color="#fff" />
            <Text style={styles.floatingButtonLabel}>Tender</Text>
          </TouchableOpacity>
        </>
      )}

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const label = {
          Home: t("tabs.home"),
          Tenders: t("tabs.tenders"),
          OnlineBidding: t("tabs.bidding"),
          Profile: t("tabs.profile"),
        }[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            if (route.name === "Tenders" && !user) {
              Toast.show({
                type: "error",
                text1: "Login Required",
                text2: "Please login to continue",
              });
              return;
            }

            if (route.name !== "CenterButton") {
              navigation.navigate(route.name);
            }
          }
        };

        const iconMap = {
          Home: "home-outline",
          Tenders: "document-text-outline",
          OnlineBidding: "cash-outline",
          Profile: "person-outline",
        };

        if (route.name === "CenterButton") {
          return (
            <View
              key={route.key}
              style={{ width: centerButtonSize, height: centerButtonSize }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (!user) {
                    Toast.show({
                      type: "error",
                      text1: "Login Required",
                      text2: "Please login to continue",
                    });
                    return;
                  }
                  setShowActions((prev) => !prev);
                }}
                style={styles.centerButtonWrapper}
              >
                <View style={styles.centerButton}>
                  <Icon
                    name="add-circle"
                    size={centerButtonSize * 0.8}
                    color="#ed8936"
                  />
                </View>
              </TouchableOpacity>
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.regularTabItem}
          >
            <Icon
              name={
                isFocused
                  ? iconMap[route.name].replace("-outline", "")
                  : iconMap[route.name]
              }
              size={24}
              color={isFocused ? "#ed8936" : "gray"}
            />
            <Text
              style={{ color: isFocused ? "#ed8936" : "gray", fontSize: 11 }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
};

// Main Navigator
export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Tenders" component={ListingStackNavigator} />
      <Tab.Screen
        name="CenterButton"
        component={() => null}
        options={{
          tabBarLabel: "",
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen name="OnlineBidding" component={OnlineBidding} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingTop: 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
    justifyContent: "space-around",
    alignItems: "center",
  },
  regularTabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  centerButtonWrapper: {
    position: "absolute",
    top: -20,
    alignSelf: "center",
    width: 60,
    height: 60,
    zIndex: 10,
  },
  centerButton: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingCircleButton: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#6f2dbd",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  floatingButtonLabel: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
});
