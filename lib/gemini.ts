import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from "expo-constants";

const genAI = new GoogleGenerativeAI(Constants.expoConfig?.extra?.geminiApiKey);

export const generateSentence = async (
  words: string[],
  previousSentences: string[] = []
) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a simple one line Korean sentence using these words: ${words.join(
      ", "
    )}. The sentence should be different from these previous sentences: ${previousSentences.join(
      ", "
    )}
    The new response should ONLY contain the Korean sentence and it's english translation, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating sentence:", error);
    throw error;
  }
};

export const suggestRelatedWords = async (context: string, count: number) => {
  console.log(context, count);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Suggest 1 new Korean word that are related to the context of: ${context}.
                   Format the response a JSON array of objects inside string, each with 'korean' and 'english' properties.
                   Example: [{"korean": "의자", "english": "Chair"}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    const match = responseText.match(/\[.*\]/);
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

export const generateGrammarExplanation = async (sentence: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Explain the grammar of this Korean sentence concisely: ${sentence}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating grammar explanation:", error);
    throw error;
  }
};
