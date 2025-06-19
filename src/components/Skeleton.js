// components/CardSkeleton.js
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

const Skeleton = ({ width, height, borderRadius = 8, style }) => {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animation.value,
      [0, 1],
      ["#e0e0e0", "#d1d1d1"]
    );
    return { backgroundColor };
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export default function CardSkeleton() {
  return (
    <View style={styles.card}>
      {/* Image placeholder */}
      <Skeleton width="100%" height={140} borderRadius={12} />

      {/* Content lines */}
      <View style={{ padding: 12 }}>
        <Skeleton width="70%" height={20} style={{ marginBottom: 10 }} />
        <Skeleton width="90%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="50%" height={14} />

        {/* CTA / Button placeholder */}
        <Skeleton
          width={100}
          height={30}
          borderRadius={16}
          style={{ marginTop: 16 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 2, // shadow for Android
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
