import React, { useState } from "react";
import { StyleSheet, Pressable, Modal, View, TextInput } from "react-native";
import { Text } from "./Themed";
import { useBoxStore } from "../stores/boxStore";
import { boxColors } from "../constants/Colors";

export default function AddBoxButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const [boxName, setBoxName] = useState("");
  const [wordLimit, setWordLimit] = useState("");
  const [selectedColor, setSelectedColor] = useState(boxColors[0]);
  const addBox = useBoxStore((state) => state.addBox);

  const handleCreateBox = () => {
    if (boxName && wordLimit) {
      addBox({
        name: boxName,
        color: selectedColor,
        wordLimit: parseInt(wordLimit),
        words: [],
      });
      setModalVisible(false);
      setBoxName("");
      setWordLimit("");
      setSelectedColor(boxColors[0]);
    }
  };

  return (
    <>
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>+</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Box</Text>

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

            <View style={styles.colorGrid}>
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
            </View>

            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateBox}
              >
                <Text>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
});
