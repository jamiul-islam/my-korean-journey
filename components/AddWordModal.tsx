import React, { useState } from "react";
import { StyleSheet, Modal, TextInput, Pressable } from "react-native";
import { Text, View } from "./Themed";

interface AddWordModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (korean: string, english: string) => void;
}

export default function AddWordModal({
  visible,
  onClose,
  onAdd,
}: AddWordModalProps) {
  const [korean, setKorean] = useState("");
  const [english, setEnglish] = useState("");

  const handleAdd = () => {
    if (korean && english) {
      onAdd(korean, english);
      setKorean("");
      setEnglish("");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Word</Text>

          <TextInput
            style={styles.input}
            placeholder="Korean Word"
            value={korean}
            onChangeText={setKorean}
          />

          <TextInput
            style={styles.input}
            placeholder="English Translation"
            value={english}
            onChangeText={setEnglish}
          />

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.addButton]}
              onPress={handleAdd}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  addButton: {
    backgroundColor: "#2f95dc",
  },
  addButtonText: {
    color: "white",
  },
});
