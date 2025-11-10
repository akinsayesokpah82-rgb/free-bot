import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

// frontend build serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "frontend/dist")));

// root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

// chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating response" });
  }
});

app.listen(PORT, () => console.log(`🧠 Free Bot backend running on port ${PORT}`));
