import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Word {
  id: string;
  korean: string;
  english: string;
  color: string;
}

export interface Box {
  id: string;
  name: string;
  color: string;
  wordLimit: number;
  words: Word[];
}

interface BoxState {
  boxes: Box[];
  addBox: (box: Omit<Box, "id">) => void;
  addWord: (boxId: string, word: Omit<Word, "id">) => void;
  removeBox: (id: string) => void;
  removeWord: (boxId: string, wordId: string) => void;
  updateBox: (id: string, updates: Partial<Box>) => void;
  updateWord: (boxId: string, wordId: string, updates: Partial<Word>) => void;
}

export const useBoxStore = create<BoxState>((set, get) => ({
  boxes: [],
  addBox: (box) => {
    set((state) => {
      const newBox = { ...box, id: Date.now().toString() };
      const newState = { boxes: [...state.boxes, newBox] };
      AsyncStorage.setItem("boxes", JSON.stringify(newState.boxes));
      return newState;
    });
  },
  addWord: (boxId, word) => {
    set((state) => {
      const newWord = { ...word, id: Date.now().toString() };
      const newBoxes = state.boxes.map((box) => {
        if (box.id === boxId) {
          return { ...box, words: [...box.words, newWord] };
        }
        return box;
      });
      AsyncStorage.setItem("boxes", JSON.stringify(newBoxes));
      return { boxes: newBoxes };
    });
  },
  removeBox: (id) => {
    set((state) => {
      const newBoxes = state.boxes.filter((box) => box.id !== id);
      AsyncStorage.setItem("boxes", JSON.stringify(newBoxes));
      return { boxes: newBoxes };
    });
  },
  removeWord: (boxId, wordId) => {
    set((state) => {
      const newBoxes = state.boxes.map((box) => {
        if (box.id === boxId) {
          return {
            ...box,
            words: box.words.filter((word) => word.id !== wordId),
          };
        }
        return box;
      });
      AsyncStorage.setItem("boxes", JSON.stringify(newBoxes));
      return { boxes: newBoxes };
    });
  },
  updateBox: (id, updates) => {
    set((state) => {
      const newBoxes = state.boxes.map((box) => {
        if (box.id === id) {
          return { ...box, ...updates };
        }
        return box;
      });
      AsyncStorage.setItem("boxes", JSON.stringify(newBoxes));
      return { boxes: newBoxes };
    });
  },
  updateWord: (boxId, wordId, updates) => {
    set((state) => {
      const newBoxes = state.boxes.map((box) => {
        if (box.id === boxId) {
          const newWords = box.words.map((word) => {
            if (word.id === wordId) {
              return { ...word, ...updates };
            }
            return word;
          });
          return { ...box, words: newWords };
        }
        return box;
      });
      AsyncStorage.setItem("boxes", JSON.stringify(newBoxes));
      return { boxes: newBoxes };
    });
  },
}));

// Load initial state from AsyncStorage
AsyncStorage.getItem("boxes").then((boxes) => {
  if (boxes) {
    useBoxStore.setState({ boxes: JSON.parse(boxes) });
  }
});
