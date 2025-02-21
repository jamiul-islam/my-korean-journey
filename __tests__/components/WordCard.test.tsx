import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import WordCard from "../../components/WordCard";

describe("WordCard Component", () => {
  const mockWord = {
    id: "1",
    korean: "안녕하세요",
    english: "Hello",
    color: "#F5C8A8",
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("🎨 renders with correct initial content", () => {
    const { getByText } = render(
      <WordCard word={mockWord} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(getByText("안녕하세요")).toBeTruthy();
  });

  // Simplified test that doesn't rely on animations
  it("🔄 shows both Korean and English text", () => {
    const { getByText } = render(
      <WordCard word={mockWord} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );

    expect(getByText("안녕하세요")).toBeTruthy();
    expect(getByText("Hello")).toBeTruthy();
  });
});
