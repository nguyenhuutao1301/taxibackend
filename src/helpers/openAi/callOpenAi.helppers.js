import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export default async function callGPT(prompt) {
  const res = await openai.responses.create({
    model: "gpt-5-nano", // GPT-5-nano
    input: prompt,
  });
  return res.output_text;
}
