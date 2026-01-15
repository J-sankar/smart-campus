import { GoogleGenerativeAI } from "@google/generative-ai";
import History from "../models/History.js";
import dotenv from 'dotenv';
dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateRoomInsights = async (roomId) => {
  try {
    // 1. Fetch last 50 entries for this room
    const logs = await History.find({ roomId })
      .sort({ timestamp: -1 })
      .limit(50); // Limit data so we don't overflow the prompt

    if (logs.length === 0) return "No data available yet.";

    // 2. Prepare Data Summary for AI
    const summary = logs.map(log => 
      `- ${log.dayOfWeek} at ${log.timestamp.toLocaleTimeString()}: ${log.occupancy}/${log.capacity} people. Ghost: ${log.isGhost}`
    ).join("\n");

    // 3. Construct the Prompt
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      Act as a University Facility Manager. Analyze the following room usage logs for Room ${roomId}.
      
      Logs:
      ${summary}

      Provide 3 short, actionable insights in this JSON format:
      {
        "efficiency_score": "0-100%",
        "peak_time": "e.g. Monday Mornings",
        "recommendation": "One specific suggestion to save energy or improve usage."
      }
    `;

    // 4. Get Response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up JSON (sometimes AI adds markdown backticks)
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("AI Error:", error);
    return { error: "Failed to generate insights" };
  }
};