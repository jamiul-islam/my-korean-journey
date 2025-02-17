import React, { useRef } from "react";
import { StyleSheet, Animated, Pressable } from "react-native";
import { Text } from "./Themed";
import { Word } from "../stores/boxStore";

interface WordCardProps {
  word: Word;
}

export default function WordCard({ word }: WordCardProps) {
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const flipRotation = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backRotation = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const handleFlip = () => {
    Animated.spring(flipAnimation, {
      toValue: flipAnimation._value === 0 ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const frontAnimatedStyle = {
    transform: [{ rotateY: flipRotation }],
  };
  const backAnimatedStyle = {
    transform: [{ rotateY: backRotation }],
  };

  return (
    <Pressable style={styles.container} onPress={handleFlip}>
      <Animated.View
        style={[
          styles.card,
          styles.frontCard,
          { backgroundColor: word.color },
          frontAnimatedStyle,
        ]}
      >
        <Text style={styles.text}>{word.korean}</Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.card,
          styles.backCard,
          { backgroundColor: word.color },
          backAnimatedStyle,
        ]}
      >
        <Text style={styles.text}>{word.english}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "48%",
    height: 100,
    marginBottom: 10,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  frontCard: {
    zIndex: 1,
  },
  backCard: {
    transform: [{ rotateY: "180deg" }],
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
