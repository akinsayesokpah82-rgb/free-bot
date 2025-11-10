import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());

// --- serve built frontend ---
app.use(express.static(path.join(__dirname, "../frontend/dist")));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- chat endpoint ---
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Free Bot, an intelligent assistant created by Akin S. Sokpah.",
        },
        { role: "user", content: message },
      ],
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "⚠️ Server error." });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`🧠 Free Bot backend running on ${port}`));
