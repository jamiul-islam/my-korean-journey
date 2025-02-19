import React, { useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import { Text } from "./Themed";
import { useBoxStore } from "../stores/boxStore";
import AddBoxModal from "./AddBoxModal";

export default function AddBoxButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const addBox = useBoxStore((state) => state.addBox);

  const handleCreateBox = (name: string, color: string, wordLimit: number) => {
    addBox({
      name,
      color,
      wordLimit,
      words: [],
    });
    setModalVisible(false);
  };

  return (
    <>
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>+</Text>
      </Pressable>

      <AddBoxModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleCreateBox}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#2f95dc",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
    color: "white",
  },
});
