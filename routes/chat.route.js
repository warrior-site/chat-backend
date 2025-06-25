import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const Router = express.Router();

Router.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`; // Or gemini-1.5-pro-latest
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      // ⭐ ADD THIS GENERATION CONFIGURATION ⭐
      generationConfig: {
        maxOutputTokens: 100, // Adjust this value to control response length
        // You can also add other parameters here, like:
        // temperature: 0.7, // Controls randomness: lower for more deterministic, higher for more creative
        // topP: 0.9,      // Nucleus sampling
        // topK: 40,       // Top-k sampling
      },
    };

    const response = await axios.post(
      GEMINI_API_ENDPOINT,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY, // Or use params: { key: GEMINI_API_KEY }
        },
        params: {
          key: GEMINI_API_KEY
        }
      }
    );

    const aiResponse = response.data.candidates[0]?.content?.parts[0]?.text;

    if (!aiResponse) {
        console.error("AI Chat Error: No content found in Gemini response", response.data);
        return res.status(500).json({ error: "Failed to get AI response: No content generated." });
    }

    res.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error("AI Chat Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

export default Router;