import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 💡 Example route for sanity check
app.get("/api", (req, res) => {
  res.json({ message: "🧠 Free Bot backend API is working!" });
});

// =============================
// 🔹 Serve React Frontend Build
// =============================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

// For any route not handled by the API, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// =============================
// 🔹 Start the Server
// =============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
