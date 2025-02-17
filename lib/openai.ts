import OpenAI from "openai";
import Constants from "expo-constants";

const openai = new OpenAI({
  apiKey: Constants.expoConfig?.extra?.openaiApiKey,
});

export const generateSentence = async (words: string[]) => {
  console.log(words);
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150,
      messages: [
        {
          role: "developer",
          content:
            "You are a Korean language teacher. Create a simple one line Korean sentence using the provided words.",
        },
        {
          role: "user",
          content: `Create a simple one line Korean sentence using these words: ${words.join(
            ", "
          )}`,
        },
      ],
      store: true,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating sentence:", error);
    throw error;
  }
};

export const generateGrammarExplanation = async (sentence: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content:
            "You are a Korean language teacher. Explain the grammar of the provided Korean sentence concisely.",
        },
        {
          role: "user",
          content: `Explain the grammar of this Korean sentence: ${sentence}`,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating grammar explanation:", error);
    throw error;
  }
};

export const suggestRelatedWords = async (context: string, count: number) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content:
            "You are a Korean language teacher. Suggest related Korean words based on the context.",
        },
        {
          role: "user",
          content: `Suggest ${count} Korean words related to: ${context}`,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error suggesting related words:", error);
    throw error;
  }
};
