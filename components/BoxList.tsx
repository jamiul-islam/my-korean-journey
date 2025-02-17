import React from "react";
import { StyleSheet, FlatList, Pressable } from "react-native";
import { Text, View } from "./Themed";
import { Box } from "../stores/boxStore";
import { useRouter } from "expo-router";

interface BoxListProps {
  boxes: Box[];
}

export default function BoxList({ boxes }: BoxListProps) {
  const router = useRouter();

  const renderBox = ({ item }: { item: Box }) => (
    <Pressable
      style={[styles.box, { backgroundColor: item.color }]}
      onPress={() => router.push(`/box/${item.id}`)}
    >
      <Text style={styles.boxName}>{item.name}</Text>
      <Text style={styles.boxInfo}>
        {item.words.length}/{item.wordLimit} words
      </Text>
    </Pressable>
  );

  return (
    <FlatList
      data={boxes}
      renderItem={renderBox}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  box: {
    flex: 1,
    margin: 8,
    height: 150,
    borderRadius: 15,
    padding: 15,
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  boxName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  boxInfo: {
    fontSize: 14,
  },
});
