  // gemini.ts
  // Initializes the Gemini AI client for server-side use.
  // Other files import this to access Gemini models (categorization, summaries, etc.)

import { GoogleGenAI } from "@google/genai";

export const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
