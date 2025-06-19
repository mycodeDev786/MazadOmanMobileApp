import React, { useEffect } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const DOT_COUNT = 8;
const DOT_SIZE = 10;
const RADIUS = 30;

export default function LoadingIndicator() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1200,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const rotatingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const renderDots = () => {
    return Array.from({ length: DOT_COUNT }).map((_, index) => {
      const angle = (index / DOT_COUNT) * 2 * Math.PI;
      const x = Math.cos(angle) * RADIUS;
      const y = Math.sin(angle) * RADIUS;

      return (
        <View
          key={index}
          style={[
            styles.dot,
            {
              transform: [{ translateX: x }, { translateY: y }],
            },
          ]}
        />
      );
    });
  };

  return (
    <BlurView intensity={80} tint="light" style={styles.overlay}>
      <Animated.View style={[styles.loader, rotatingStyle]}>
        {renderDots()}
      </Animated.View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  loader: {
    width: RADIUS * 2 + DOT_SIZE,
    height: RADIUS * 2 + DOT_SIZE,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#F59E0B", // Orange (you can replace with Windows blue if desired)
  },
});
