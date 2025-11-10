import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve the built frontend
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// ✅ API example route
app.get("/api", (req, res) => {
  res.json({ message: "🧠 Free Bot backend connected successfully!" });
});

// ✅ Catch-all for frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
