import { GoogleGenAI } from "@google/genai";

const apikey = process.env.GEMINI_API_KEY;
if (!apikey) throw new Error("Gemini API key is not provided");

export const PREFERRED_MULTIMODAL_MODEL =
  process.env.GEMINI_PREFERRED_MODEL || "gemini-multimodal";

export const ai = new GoogleGenAI({
  apiKey: apikey,
  vertexai: true,
});

export function getPreferredMultimodalModel() {
  return PREFERRED_MULTIMODAL_MODEL;
}
