import React, { useState } from "react";
import { StyleSheet, FlatList, Pressable, Alert } from "react-native";
import { Text, View } from "./Themed";
import { Box } from "../stores/boxStore";
import { useRouter } from "expo-router";
import { useBoxStore } from "../stores/boxStore";
import AddBoxModal from "./AddBoxModal";

interface BoxListProps {
  boxes: Box[];
}

export default function BoxList({ boxes }: BoxListProps) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const removeBox = useBoxStore((state) => state.removeBox);
  const updateBox = useBoxStore((state) => state.updateBox);

  const handleLongPress = (box: Box) => {
    Alert.alert("Box Options", "What would you like to do with this box?", [
      {
        text: "Edit",
        onPress: () => {
          setSelectedBox(box);
          setShowEditModal(true);
        },
      },
      {
        text: "Delete",
        onPress: () => {
          Alert.alert(
            "Delete Box",
            "Are you sure you want to delete this box? This action cannot be undone.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Delete",
                onPress: () => removeBox(box.id),
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

  const handleEditBox = (name: string, color: string, wordLimit: number) => {
    if (selectedBox) {
      updateBox(selectedBox.id, { name, color, wordLimit });
      setShowEditModal(false);
      setSelectedBox(null);
    }
  };

  const renderBox = ({ item }: { item: Box }) => (
    <Pressable
      style={[styles.box, { backgroundColor: item.color }]}
      onPress={() => router.push(`/box/${item.id}`)}
      onLongPress={() => handleLongPress(item)}
      delayLongPress={500}
    >
      <Text style={styles.boxName}>{item.name}</Text>
      <Text style={styles.boxInfo}>
        {item.words.length}/{item.wordLimit} words
      </Text>
    </Pressable>
  );

  return (
    <>
      <FlatList
        data={boxes}
        renderItem={renderBox}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.container}
      />

      <AddBoxModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBox(null);
        }}
        onAdd={handleEditBox}
        initialValues={
          selectedBox
            ? {
                name: selectedBox.name,
                color: selectedBox.color,
                wordLimit: selectedBox.wordLimit.toString(),
              }
            : undefined
        }
        isEditing={true}
      />
    </>
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
