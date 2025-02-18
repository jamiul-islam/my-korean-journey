import React, { useRef, useState } from "react";
import { StyleSheet, Animated, Pressable, Alert } from "react-native";
import { Text } from "./Themed";
import { Word } from "../stores/boxStore";
import EditWordModal from "./EditWordModal";

interface WordCardProps {
  word: Word;
  onEdit?: (korean: string, english: string) => void;
  onDelete?: () => void;
}

export default function WordCard({ word, onEdit, onDelete }: WordCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
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
      // @ts-ignore
      toValue: flipAnimation._value === 0 ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleLongPress = () => {
    Alert.alert("Word Options", "What would you like to do with this word?", [
      {
        text: "Edit",
        onPress: () => setShowEditModal(true),
      },
      {
        text: "Delete",
        onPress: () => {
          Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this word?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Delete",
                onPress: onDelete,
                style: "destructive",
              },
            ]
          );
        },
        style: "destructive",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const frontAnimatedStyle = {
    transform: [{ rotateY: flipRotation }],
  };
  const backAnimatedStyle = {
    transform: [{ rotateY: backRotation }],
  };

  return (
    <>
      <Pressable
        style={styles.container}
        onPress={handleFlip}
        onLongPress={handleLongPress}
        delayLongPress={500}
      >
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

      <EditWordModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={(korean, english) => {
          if (onEdit) {
            onEdit(korean, english);
          }
          setShowEditModal(false);
        }}
        initialKorean={word.korean}
        initialEnglish={word.english}
      />
    </>
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
