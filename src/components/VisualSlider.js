import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, Image, Dimensions, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width: viewportWidth } = Dimensions.get("window");

export default function VisualSlider({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0); // State to track active slide

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={item.href}>
        <View style={styles.slide}>
          <Image
            source={{ uri: `https://mazadoman.com/backend/${item?.image}` }}
            style={styles.slideImage}
            resizeMode="cover"
          />
          <Text style={styles.slideTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Promoted Products</Text>
      {slides?.length > 0 ? (
        <>
          <Carousel
            loop
            width={viewportWidth * 0.9}
            height={250}
            autoPlay={true}
            autoPlayInterval={3000}
            data={slides}
            renderItem={renderItem}
            onSnapToItem={(index) => setActiveIndex(index)}
            style={styles.carousel}
          />

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeIndex ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Loading slides...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#FFCC80", // Equivalent to orange-400
    alignItems: "center",
  },
  carousel: {
    alignSelf: "center",
  },

  headerTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#C2185B", // Equivalent to fuchsia-600
    marginBottom: 15,
  },
  slide: {
    borderRadius: 8,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  slideImage: {
    width: "90%",
    height: "80%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  slideTitle: {
    fontSize: 16,
    fontWeight: "600",
    padding: 10,
    textAlign: "center",
    color: "#333",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 70,
  },
  // Pagination styles
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10, // Space below the carousel
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#C2185B", // Active dot color (fuchsia-600)
  },
  inactiveDot: {
    backgroundColor: "#9E9E9E", // Inactive dot color (a neutral gray)
  },
});
