/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Lazy-initialize Gemini Client
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Fallback response for Luna in case API Key is missing
const FALLBACK_ANSWERS = [
  {
    reply: "🌟 **Welcome to DineGenie, your premium AI Food Concierge!** 🌿✨\n\nSince my real-time cloud connections are in local sandbox mode, let me introduce you to some of **Jaipur's highest-rated culinary hotspots**:\n\n• ☕ **Tapri Central (C-Scheme):** Famous for their incredible **Saffron Masala Chai** (₹90) and buttery **Gourmet Bun Maska** (₹110). Perfect for cozy evenings!\n• 👑 **LMB (Johri Bazaar):** Royal heritage dessert haven. Indulge in their legendary **Special Paneer Ghewar** (₹350) or golden **Pyaaz Kachori** (₹60).\n• 🍕 **Zolocrust (Malviya Nagar):** 24/7 high-end artisanal cafe. Try the **Artisanal Almond Croissant** (₹240) paired with a rich **Cold Brew Coffee** (₹180).\n\nWhat kind of flavors are we exploring today? Ask me to recommend something under a budget, high protein, or healthy!",
    suggestions: ["Recommend something under ₹300.", "Healthy dinner.", "Best cafe nearby."]
  },
  {
    reply: "🔮 **DineGenie Concierge Mode Active!** ✨\n\nIf you are planning a premium dinner tonight in Jaipur, let me highlight a spectacular courtyard experience:\n\n🍗 **Spice Court (Civil Lines):** Renowned for their traditional **Lal Maas** (₹480) or luxurious **Paneer Butter Masala** (₹320) served with crispy garlic naans.\n\n🍃 **DineGenie Healthy Alternative:** Let's coordinate a high-protein vegetarian paneer salad or a freshly pressed herbal juice!\n\nWould you like me to curate some high protein options or check out a sweet dessert?",
    suggestions: ["High protein meals.", "Healthy dinner.", "Recommend something under ₹300."]
  },
  {
    reply: "🌿 **DineGenie Health Intelligence:** Keeping your nutrition balanced, delicious, and premium!\n\nHere are excellent low-calorie, high-protein picks from Jaipur's top kitchens:\n\n• 🥗 **High-Protein Tofu Salad** from *Zolocrust* (approx. 320 kcal, 18g protein) - loaded with fresh organic greens, edamame, and a toasted sesame drizzle.\n• 🍲 **Paneer Tikka Platter** from *Spice Court* (approx. 410 kcal, 22g protein) - cooked to charry perfection in a traditional clay tandoor.\n\nShall we customize a full high-protein dining routine for you today?",
    suggestions: ["High protein meals.", "Healthy dinner.", "What should I eat today?"]
  }
];

// Luna API Route
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, prompt } = req.body;
    
    // Validate request
    if (!prompt) {
      res.status(400).json({ error: "Missing prompt" });
      return;
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Return a structured fallback
      const randomIdx = Math.floor(Math.random() * FALLBACK_ANSWERS.length);
      const data = FALLBACK_ANSWERS[randomIdx];
      await new Promise(resolve => setTimeout(resolve, 600));
      res.json(data);
      return;
    }

    // Format conversation history for Gemini API
    const systemInstruction = 
      "You are Luna, DineGenie's premium AI Food Concierge and ultimate culinary assistant in Jaipur, India. " +
      "You help users pick the perfect meal based on their mood, budget, cravings, diet, and lifestyle. " +
      "Your tone is that of an elite Michelin-starred hospitality concierge—warm, professional, highly knowledgeable, and welcoming. " +
      "When recommending meals, refer to Jaipur's realistic premium restaurants and food items: " +
      "1. Tapri Central in C-Scheme (famous for Saffron Masala Chai, Bun Maska, local snacks, and rooftop park views). " +
      "2. Laxmi Mishthan Bhandar (LMB) in Johri Bazaar (famous for royal Rajasthani sweets, Ghewar, Pyaaz Kachori, and deluxe thalis). " +
      "3. Spice Court in Civil Lines (famous for Lal Maas, Keema Baati, Paneer Butter Masala, and live music). " +
      "4. Zolocrust in Malviya Nagar (exquisite 24/7 artisanal bakery/cafe known for Almond Croissants, sourdough pizzas, artisanal coffee, and high-end desserts). " +
      "Use food emojis gracefully to add visual joy. " +
      "Keep the response highly structured using Markdown bold texts, short paragraphs, and bullet points. Avoid walls of text. " +
      "Suggest reasonable prices in Indian Rupees (₹). " +
      "Provide highly specific answers when asked: " +
      "- 'Recommend something under ₹300': Recommend affordable Jaipur eats like Tapri's Masala Chai (₹90) + Bun Maska (₹110) or LMB's Pyaaz Kachori (₹60). " +
      "- 'Healthy dinner': Recommend high-nutrition options like grilled paneer tikka from Spice Court or fresh organic salads from Zolocrust. " +
      "- 'Best cafe nearby': Rave about Tapri Central or Zolocrust. " +
      "- 'High protein meals': Focus on paneer tikka, lentil dishes, or specialized salads. " +
      "- 'What should I eat today?': Ask about their current mood or craving and suggest a delicious combo. " +
      "You MUST return a JSON object with two fields:\n" +
      "1. 'reply': A string containing your beautiful markdown-formatted response.\n" +
      "2. 'suggestions': An array of exactly 2-3 highly relevant, short follow-up suggested replies (e.g. ['Is it vegetarian?', 'What is the price?', 'Show me the menu']).";

    const formattedHistory = (messages || []).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add current user prompt
    const contents = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: prompt }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { 
              type: Type.STRING,
              description: "The Markdown formatted conversational response to the user."
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 2-3 short, contextually-relevant follow-up suggested replies."
            }
          },
          required: ["reply", "suggestions"]
        }
      }
    });

    try {
      const parsed = JSON.parse(response.text.trim());
      res.json(parsed);
    } catch (parseErr) {
      // Fallback if parsing fails
      res.json({ 
        reply: response.text, 
        suggestions: ["Recommend something under ₹300.", "Healthy dinner.", "Best cafe nearby."] 
      });
    }
  } catch (error: any) {
    console.error("Luna Error:", error);
    res.status(500).json({ 
      error: "Failed to communicate with Luna", 
      details: error.message || error 
    });
  }
});

// Setup Vite Dev Server / Serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DineGenie Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
