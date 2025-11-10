import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

// For ES modules (to resolve __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 🧠 Basic AI-like Chat Endpoint
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  // Basic logic — you can replace this with OpenAI or custom logic
  let reply = "🤖 I’m not sure what you mean.";
  if (message) {
    if (message.toLowerCase().includes("hello"))
      reply = "👋 Hello there! I’m Free Bot by Akin S. Sokpah.";
    else if (message.toLowerCase().includes("who created you"))
      reply = "🧠 I was created by Akin S. Sokpah from Liberia.";
    else if (message.toLowerCase().includes("bye"))
      reply = "👋 Goodbye! God bless you.";
    else
      reply = `🧠 Free Bot received: "${message}"`;
  }

  res.json({ reply });
});

// 🧩 Serve Frontend
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Confirm server running
app.listen(PORT, () => console.log(`🧠 Free Bot backend running on port ${PORT}`));
