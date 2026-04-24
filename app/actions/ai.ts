"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateAIResponse(prompt: string, history: { role: string; parts: [{ text: string }] }[]) {
  if (!genAI) {
    return { error: "Gemini API key is not configured on the server. Please add GEMINI_API_KEY to your .env file." };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Convert generic history to Gemini format if needed, but the structure passed matches Gemini's expectations
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return { text: response.text() };
  } catch (error: any) {
    console.error("Error generating AI response:", error);
    return { error: error.message || "Failed to generate response from Gemini API." };
  }
}
