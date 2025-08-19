import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import extractData from "./extractData.helppers.js";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// helpers/extractData.js

// Hàm gọi Gemini AI
export default async function callGeminiAi(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    // Gemini trả về text trong object response
    const res = extractData(result.response.text());
    return res;
  } catch (error) {
    console.error("Lỗi khi gọi Gemini AI:", error);
    throw error;
  }
}
