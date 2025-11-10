import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Simple AI-like response system
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.json({ reply: "Please say something 😅" });
  }

  // Example smart replies (you can customize or connect real AI)
  let reply = "";

  if (message.toLowerCase().includes("hello")) {
    reply = "👋 Hi there! I’m FreeBot, your AI assistant.";
  } else if (message.toLowerCase().includes("who created you")) {
    reply = "I was proudly created by Akin S. Sokpah from Liberia 🇱🇷";
  } else if (message.toLowerCase().includes("jesus")) {
    reply = "🙌 Jesus is Lord! Would you like a Bible verse?";
  } else if (message.toLowerCase().includes("bible verse")) {
    reply = "📖 John 3:16 — For God so loved the world that He gave His only Son.";
  } else if (message.toLowerCase().includes("education")) {
    reply = "🎓 Education is the key to success. I can help you study too!";
  } else {
    reply = `🤖 You said: "${message}" — and I’m still learning to understand you better!`;
  }

  res.json({ reply });
});

// ✅ Root route (for testing)
app.get("/", (req, res) => {
  res.send("🧠 Free Bot backend is running successfully!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
