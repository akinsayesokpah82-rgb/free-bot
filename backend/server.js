import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Serve frontend dist
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// API example
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  res.json({ reply: `Bot: You said "${message}"` });
});

app.listen(PORT, () => console.log(`🧠 Free Bot running on port ${PORT}`));
