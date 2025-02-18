import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  Animated,
  ScrollView,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { useLocalSearchParams } from "expo-router";
import { useBoxStore } from "../../stores/boxStore";
import WordCard from "../../components/WordCard";
import AddWordModal from "../../components/AddWordModal";
import { generateGrammarExplanation, generateSentence } from "../../lib/gemini";

export default function BoxScreen() {
  const { id } = useLocalSearchParams();
  const box = useBoxStore((state) => state.boxes.find((b) => b.id === id));
  const addWord = useBoxStore((state) => state.addWord);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sentence, setSentence] = useState("");
  // const [grammarExplanation, setGrammarExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!box) return null;

  const handleAddWord = (korean: string, english: string) => {
    addWord(box.id, {
      korean,
      english,
      color: box.color,
    });
    setIsModalVisible(false);
  };

  const handleGenerateSentence = async () => {
    setIsLoading(true);
    try {
      const koreanWords = box.words.map((w) => w.korean);
      const newSentence = await generateSentence(koreanWords);
      setSentence(newSentence as any);
      // const explanation = await generateGrammarExplanation(newSentence as any);
      // setGrammarExplanation(explanation as any);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* --------------- BOX NAME ---------------  */}
      <View style={styles.header}>
        <Text style={styles.title}>{box.name}</Text>
        <Text style={styles.subtitle}>
          {box.words.length}/{box.wordLimit} words
        </Text>
      </View>

      {/* --------------- WORD GRID ---------------  */}
      <View style={styles.wordGrid}>
        {box.words.map((word) => (
          <WordCard key={word.id} word={word} />
        ))}
      </View>

      {/* --------------- BUTTONS ---------------  */}
      {box.words.length < box.wordLimit && (
        <Pressable
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.buttonText}>Add Word</Text>
        </Pressable>
      )}

      {box.words.length > 0 && (
        <Pressable
          style={[styles.generateButton, isLoading && styles.disabledButton]}
          onPress={handleGenerateSentence}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Generating..." : "Generate Sentence"}
          </Text>
        </Pressable>
      )}

      {sentence && (
        <View style={styles.sentenceContainer}>
          <Text style={styles.sentenceTitle}>Generated Sentence:</Text>
          <Text style={styles.sentence}>{sentence}</Text>
          {/* <Text style={styles.grammarTitle}>Grammar Explanation:</Text>
          <Text style={styles.grammar}>{grammarExplanation}</Text> */}
        </View>
      )}

      <AddWordModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onAdd={handleAddWord}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  wordGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: "#2f95dc",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  generateButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sentenceContainer: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 20,
  },
  sentenceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sentence: {
    fontSize: 16,
    marginBottom: 15,
  },
  grammarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  grammar: {
    fontSize: 16,
  },
});
