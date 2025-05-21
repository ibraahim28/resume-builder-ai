import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generate = async (systemMessage, userMessage) => {
  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemMessage }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. Please provide the user's details." }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini error:", error);
    return "Error generating summary.";
  }
};
