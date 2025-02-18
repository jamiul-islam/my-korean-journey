import React, { useState, useEffect } from "react";
import { StyleSheet, Modal, TextInput, Pressable } from "react-native";
import { Text, View } from "./Themed";

interface EditWordModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (korean: string, english: string) => void;
  initialKorean?: string;
  initialEnglish?: string;
}

export default function EditWordModal({
  visible,
  onClose,
  onSave,
  initialKorean = "",
  initialEnglish = "",
}: EditWordModalProps) {
  const [korean, setKorean] = useState(initialKorean);
  const [english, setEnglish] = useState(initialEnglish);

  useEffect(() => {
    setKorean(initialKorean);
    setEnglish(initialEnglish);
  }, [initialKorean, initialEnglish]);

  const handleSave = () => {
    if (korean && english) {
      onSave(korean, english);
      onClose();
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
          <Text style={styles.modalTitle}>Edit Word</Text>

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
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
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
  saveButton: {
    backgroundColor: "#2f95dc",
  },
  saveButtonText: {
    color: "white",
  },
});
