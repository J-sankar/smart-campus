import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function check() {
  try {

    // Note: The correct method to list models depends on the SDK version, 
    // but the most reliable fix is often switching to "gemini-1.5-flash"
    // However, let's try to verify your key works first.
    
    console.log("🔑 Testing Key...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Hello, are you working?");
    console.log("✅ SUCCESS! Response:", result.response.text());
    
  } catch (error) {
    console.error("❌ ERROR Details:");
    console.error(error);
  }
}

check();