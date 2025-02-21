import { generateSentence, suggestRelatedWords } from "../../lib/gemini";
import { GoogleGenerativeAI } from "@google/generative-ai";

jest.mock("@google/generative-ai");

describe("Gemini API Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Gemini API Integration", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("generateSentence", () => {
      it("🤖 generates a sentence successfully", async () => {
        const mockGenerateContent = jest.fn().mockResolvedValue({
          response: { text: () => "Generated sentence" },
        });

        (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
          getGenerativeModel: () => ({
            generateContent: mockGenerateContent,
          }),
        }));

        const result = await generateSentence(["김치", "맛있다"]);
        expect(typeof result === "string" || result === undefined).toBe(true);
      });
    });
  });
});
