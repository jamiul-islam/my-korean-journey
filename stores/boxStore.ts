import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Word {
  id: string;
  korean: string;
  english: string;
  color: string;
}

export interface GeneratedSentence {
  id: string;
  text: string;
  timestamp: string;
}

export interface Box {
  id: string;
  name: string;
  color: string;
  wordLimit: number;
  words: Word[];
  sentences: GeneratedSentence[];
}

interface BoxState {
  boxes: Box[];
  addBox: (box: Omit<Box, "id" | "sentences">) => void;
  addWord: (boxId: string, word: Omit<Word, "id">) => void;
  removeBox: (id: string) => void;
  removeWord: (boxId: string, wordId: string) => void;
  updateBox: (id: string, updates: Partial<Box>) => void;
  updateWord: (boxId: string, wordId: string, updates: Partial<Word>) => void;
  addSentence: (boxId: string, text: string) => void;
}

export const useBoxStore = create<BoxState>((set, get) => ({
  boxes: [],
  addBox: (box) => {
    set((state) => {
      const newBox = {
        ...box,
        id: Date.now().toString(),
        sentences: [], // Initialize empty sentences array
      };
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
          return {
            ...box,
            words: [...box.words, newWord],
          };
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
          return {
            ...box,
            ...updates,
            sentences: box.sentences || [], // Ensure sentences array exists
          };
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
  addSentence: (boxId, text) => {
    set((state) => {
      const newBoxes = state.boxes.map((box) => {
        if (box.id === boxId) {
          const newSentence = {
            id: Date.now().toString(),
            text,
            timestamp: new Date().toISOString(),
          };
          const sentences = box.sentences || []; // Handle case where sentences might be undefined
          return {
            ...box,
            sentences: [newSentence, ...sentences],
          };
        }
        return box;
      });
      AsyncStorage.setItem("boxes", JSON.stringify(newBoxes));
      return { boxes: newBoxes };
    });
  },
}));

// Load initial state from AsyncStorage and ensure sentences array exists
AsyncStorage.getItem("boxes")?.then((boxes) => {
  if (boxes) {
    const parsedBoxes = JSON.parse(boxes);
    // Ensure each box has a sentences array
    const normalizedBoxes = parsedBoxes.map((box: Box) => ({
      ...box,
      sentences: box.sentences || [],
    }));
    useBoxStore.setState({ boxes: normalizedBoxes });
  }
});
