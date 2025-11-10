// backend/server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

// Helper to get correct __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Serve Frontend Build ===
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// === Example API Endpoint ===
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Fake AI reply (you can connect real API here later)
    const reply = `🤖 AI: You said "${message}". Nice to meet you!`;

    res.json({ reply });
  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// === Catch-all: send index.html for all non-API routes ===
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// === Start server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🧠 Free Bot backend running on port ${PORT}`));
