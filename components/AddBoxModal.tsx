import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  View as RNView,
} from "react-native";
import { Text, View } from "./Themed";
import { useBoxStore } from "../stores/boxStore";
import { boxColors } from "../constants/Colors";

interface AddBoxModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, color: string, wordLimit: number) => void;
  initialValues?: {
    name: string;
    color: string;
    wordLimit: string;
  };
  isEditing?: boolean;
}

export default function AddBoxModal({
  visible,
  onClose,
  onAdd,
  initialValues,
  isEditing = false,
}: AddBoxModalProps) {
  const [boxName, setBoxName] = useState("");
  const [wordLimit, setWordLimit] = useState("");
  const [selectedColor, setSelectedColor] = useState(boxColors[0]);

  useEffect(() => {
    if (initialValues) {
      setBoxName(initialValues.name);
      setWordLimit(initialValues.wordLimit);
      setSelectedColor(initialValues.color);
    } else {
      setBoxName("");
      setWordLimit("");
      setSelectedColor(boxColors[0]);
    }
  }, [initialValues, visible]);

  const handleSubmit = () => {
    if (boxName && wordLimit) {
      onAdd(boxName, selectedColor, parseInt(wordLimit));
      setBoxName("");
      setWordLimit("");
      setSelectedColor(boxColors[0]);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {isEditing ? "Edit Box" : "Create New Box"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Box Name"
            value={boxName}
            onChangeText={setBoxName}
            autoFocus={true}
          />

          <TextInput
            style={styles.input}
            placeholder="Word Limit"
            value={wordLimit}
            onChangeText={setWordLimit}
            keyboardType="numeric"
          />

          <RNView style={styles.colorGrid}>
            {boxColors.map((color) => (
              <Pressable
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </RNView>

          <RNView style={styles.buttonContainer}>
            <Pressable
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.createButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>
                {isEditing ? "Save" : "Create"}
              </Text>
            </Pressable>
          </RNView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
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
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  colorOption: {
    width: 30,
    height: 30,
    margin: 5,
    borderRadius: 15,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: "#000",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  createButton: {
    backgroundColor: "#2f95dc",
  },
  buttonText: {
    color: "white",
  },
});
