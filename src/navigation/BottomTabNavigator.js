import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

// Screens
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import ListingScreen from "../screens/ListingScreen";
import ProfileStackNavigator from "../navigation/ProfileStackNavigator";

const TendersScreen = () => <CenterText text="Tenders Screen" />;
const OnlineBiddingScreen = () => <CenterText text="Online Bidding Screen" />;
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

  return (
    <SafeAreaView edges={["bottom"]} style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const label =
          route.name === "Home"
            ? t("tabs.home")
            : route.name === "Tenders"
            ? t("tabs.tenders")
            : route.name === "OnlineBidding"
            ? t("tabs.bidding")
            : route.name === "Profile"
            ? t("tabs.profile")
            : "";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
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
                onPress={() => console.log("Center FAB pressed")}
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tenders" component={ListingScreen} />
      <Tab.Screen
        name="CenterButton"
        component={() => null}
        options={{
          tabBarLabel: "",
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen name="OnlineBidding" component={OnlineBiddingScreen} />
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
});
