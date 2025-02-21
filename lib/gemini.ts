import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from "expo-constants";

const genAI = new GoogleGenerativeAI(Constants.expoConfig?.extra?.geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateSentence = async (
  words: string[],
  previousSentences: string[] = []
) => {
  try {
    const prompt = `Create a simple one line Korean sentence using these words: ${words.join(
      ", "
    )}. The sentence should be different from these previous sentences: ${previousSentences.join(
      ", "
    )}
    The new response should ONLY contain the Korean sentence and it's english translation, nothing else.`;

    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    return response?.text();
  } catch (error) {
    console.error("Error generating sentence:", error);
    throw error;
  }
};

export const suggestRelatedWords = async (
  context: string,
  count: number,
  previousWords: string[] = []
) => {
  try {
    const prompt = `Suggest ${count} new Korean word except any of (${previousWords} and ${context}) - but only the ones that sounds similar in pronunciation to or related to the context of: ${context}.
                   Format the response as a JSON array of objects inside a string, each with 'korean' and 'english' properties.
                   Example: [{"korean": "의자", "english": "Chair"}]`;

    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    const responseText = await response?.text();
    const match = responseText?.match(/\[.*\]/);
    if (match) {
      return JSON.parse(match[0]);
    } else {
      throw new Error("No valid JSON array found in the response.");
    }
  } catch (error) {
    console.error("Error suggesting related words:", error);
    throw error;
  }
};
