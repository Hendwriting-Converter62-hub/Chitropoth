import { GoogleGenAI } from "@google/genai";

export async function getCraftRecommendation(query: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is interested in art and craft. Suggest a DIY craft project or a product type based on: ${query}. Keep it short and inspiring.`,
      config: {
        systemInstruction: "You are a creative craft consultant for an artisanal store.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Something unique is waiting for you! Explore our ceramics collection for inspiration.";
  }
}

export async function generateProductStory(productName: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a 2-sentence poetic description for a product named "${productName}".`,
      config: {
        systemInstruction: "You are a poetic copywriter for a high-end craft brand.",
      }
    });
    return response.text;
  } catch (error) {
    return "Each piece is crafted with soul and intention, bringing timeless beauty to your space.";
  }
}