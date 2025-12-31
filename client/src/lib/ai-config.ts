import { GoogleGenAI } from "@google/genai";

const apikey = process.env.GEMINI_API_KEY;
if (!apikey) throw new Error("Gemini API key is not provided");

export const ai = new GoogleGenAI({
  apiKey: apikey,
});


