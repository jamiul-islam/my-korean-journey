import React, { useState } from "react";
import {
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { useLocalSearchParams } from "expo-router";
import { useBoxStore } from "../../stores/boxStore";
import { generateSentence, suggestRelatedWords } from "../../lib/gemini";
import WordCard from "../../components/WordCard";
import AddWordModal from "../../components/AddWordModal";

export default function BoxScreen() {
  const { id } = useLocalSearchParams();
  const box = useBoxStore((state) => state.boxes.find((b) => b.id === id));
  const addWord = useBoxStore((state) => state.addWord);
  const updateWord = useBoxStore((state) => state.updateWord);
  const removeWord = useBoxStore((state) => state.removeWord);
  const addSentence = useBoxStore((state) => state.addSentence);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);

  if (!box) return null;

  const handleAddWord = (korean: string, english: string) => {
    addWord(box.id, {
      korean,
      english,
      color: box.color,
    });
    setIsModalVisible(false);
  };

  const handleEditWord = (wordId: string) => {
    return (korean: string, english: string) => {
      updateWord(box.id, wordId, { korean, english });
    };
  };

  const handleDeleteWord = (wordId: string) => {
    return () => {
      removeWord(box.id, wordId);
    };
  };

  const handleGenerateSentence = async () => {
    setIsLoading(true);
    try {
      const koreanWords = box.words.map((w) => w.korean);
      const previousSentences = (box.sentences || []).map((s) => s.text);
      const newSentence = await generateSentence(
        koreanWords,
        previousSentences
      );
      addSentence(box.id, newSentence);
    } catch (error) {
      console.error("Error generating content:", error);
      Alert.alert("Error", "Failed to generate sentence. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofillWords = async () => {
    setIsAutofilling(true);
    try {
      const remainingSlots = box.wordLimit - box.words.length;
      if (remainingSlots <= 0) {
        Alert.alert("Box Full", "This box has reached its word limit.");
        return;
      }

      const context = box.name;
      const previousWords = (box.words || []).map((w) => w.korean);
      const suggestedWords = await suggestRelatedWords(
        context,
        remainingSlots,
        previousWords
      );

      suggestedWords.forEach((word: { korean: string; english: string }) => {
        addWord(box.id, {
          korean: word.korean,
          english: word.english,
          color: box.color,
        });
      });

      Alert.alert("Success", "Added suggested words to the box!");
    } catch (error) {
      console.error("Error autofilling words:", error);
      Alert.alert("Error", "Failed to autofill words. Please try again.");
    } finally {
      setIsAutofilling(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{box.name}</Text>
        <Text style={styles.subtitle}>
          {box.words.length}/{box.wordLimit} words
        </Text>
      </View>

      <View style={styles.wordGrid}>
        {box.words.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            onEdit={handleEditWord(word.id)}
            onDelete={handleDeleteWord(word.id)}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        {box.words.length < box.wordLimit && (
          <Pressable
            style={styles.addButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.buttonText}>Add Word</Text>
          </Pressable>
        )}

        <Pressable
          style={[
            styles.autofillButton,
            isAutofilling && styles.disabledButton,
          ]}
          onPress={handleAutofillWords}
          disabled={isAutofilling || box.words.length >= box.wordLimit}
        >
          <Text style={styles.buttonText}>
            {isAutofilling ? "Adding Word..." : "Autofill Word"}
          </Text>
        </Pressable>

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
      </View>

      {(box.sentences || []).length > 0 && (
        <View style={styles.sentencesContainer}>
          <Text style={styles.sentencesTitle}>Generated Sentences:</Text>
          {box.sentences.map((sentence) => (
            <View key={sentence.id} style={styles.sentenceCard}>
              <Text style={styles.sentence}>{sentence.text}</Text>
              <Text style={styles.timestamp}>
                {new Date(sentence.timestamp).toLocaleString()}
              </Text>
            </View>
          ))}
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
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#2f95dc",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  autofillButton: {
    backgroundColor: "#9c27b0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  generateButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  sentencesContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  sentencesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  sentenceCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sentence: {
    fontSize: 16,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
});
