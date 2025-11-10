import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are Free Bot, an assistant created by Akin S. Sokpah." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await openaiRes.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "No response." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error, please try again." });
  }
});

app.get("/", (req, res) => {
  res.send("🧠 Free Bot backend is running successfully!");
});

app.listen(10000, () => console.log("✅ Backend running on port 10000"));
