import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import 'dotenv/config';

if (!process.env.GOOGLE_API_KEY) {
    console.error("WARNING: GOOGLE_API_KEY is missing from .env");
}

// The LLM used for planning, analyzing, and writing reports
export const llm = new ChatGoogleGenerativeAI({
    model: "gemini-3.1-flash-lite",
    apiKey: process.env.GOOGLE_API_KEY,
});
