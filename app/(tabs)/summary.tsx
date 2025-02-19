import React from "react";
import { StyleSheet, ScrollView, Pressable, SafeAreaView } from "react-native";
import { Text, View } from "../../components/Themed";
import { useBoxStore } from "../../stores/boxStore";
import { useRouter } from "expo-router";

export default function SummaryScreen() {
  const boxes = useBoxStore((state) => state.boxes);
  const router = useRouter();

  const todaysSentences = boxes.flatMap((box) =>
    box.words.length > 0
      ? [
          {
            boxId: box.id,
            boxName: box.name,
            boxColor: box.color,
            sentence: box.sentences,
            timestamp: new Date().toLocaleString(),
          },
        ]
      : []
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Today's Summary</Text>

        {todaysSentences.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No sentences generated today.{"\n"}
              Create a box and add some words to get started!
            </Text>
          </View>
        ) : (
          todaysSentences.map((item, index) => (
            <Pressable
              key={index}
              style={[styles.card, { backgroundColor: item.boxColor + "40" }]}
              onPress={() => router.push(`/box/${item.boxId}`)}
            >
              <Text style={styles.boxName}>{item.boxName}</Text>
              <Text style={styles.sentence}>
                {item.sentence.length} sentences
              </Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  boxName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sentence: {
    fontSize: 16,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
});
