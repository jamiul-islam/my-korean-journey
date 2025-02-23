import { create } from "zustand";
import { useBoxStore } from "../../stores/boxStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe("Box Store", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBoxStore.setState({ boxes: [] });
  });

  describe("Box Management", () => {
    it("📦 adds a new box", () => {
      const newBox = {
        name: "Korean Food",
        color: "#F5C8A8",
        wordLimit: 10,
        words: [],
      };

      useBoxStore.getState().addBox(newBox);
      const boxes = useBoxStore.getState().boxes;

      expect(boxes).toHaveLength(1);
      expect(boxes[0]).toMatchObject({
        ...newBox,
        sentences: [],
      });
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it("🗑️ removes a box", () => {
      const newBox = {
        name: "Korean Food",
        color: "#F5C8A8",
        wordLimit: 10,
        words: [],
      };
      useBoxStore.getState().addBox(newBox);
      const boxId = useBoxStore.getState().boxes[0].id;

      useBoxStore.getState().removeBox(boxId);
      expect(useBoxStore.getState().boxes).toHaveLength(0);
    });
  });

  describe("Word Management", () => {
    let boxId: string;

    beforeEach(() => {
      const newBox = {
        name: "Korean Food",
        color: "#F5C8A8",
        wordLimit: 10,
        words: [],
      };
      useBoxStore.getState().addBox(newBox);
      boxId = useBoxStore.getState().boxes[0].id;
    });

    it("📝 adds a word to a box", () => {
      const newWord = {
        korean: "김치",
        english: "Kimchi",
        color: "#F5C8A8",
      };

      useBoxStore.getState().addWord(boxId, newWord);
      const box = useBoxStore.getState().boxes[0];

      expect(box.words).toHaveLength(1);
      expect(box.words[0]).toMatchObject(newWord);
    });
  });

  describe("Sentence Management", () => {
    let boxId: string;

    beforeEach(() => {
      const newBox = {
        name: "Korean Food",
        color: "#F5C8A8",
        wordLimit: 10,
        words: [],
      };
      useBoxStore.getState().addBox(newBox);
      boxId = useBoxStore.getState().boxes[0].id;
    });

    it("💬 adds a sentence to a box", () => {
      const sentence = "김치는 맛있습니다.";
      useBoxStore.getState().addSentence(boxId, sentence);
      const box = useBoxStore.getState().boxes[0];

      expect(box.sentences).toHaveLength(1);
      expect(box.sentences[0].text).toBe(sentence);
    });
  });
});
