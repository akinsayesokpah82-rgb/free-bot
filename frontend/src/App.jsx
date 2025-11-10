import { useState } from "react";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function handleSend() {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      const botMsg = { role: "bot", text: data.reply };
      setMessages((m) => [...m, userMsg, botMsg]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "⚠️ Failed to connect to backend." },
      ]);
    }
  }

  return (
    <div className="chat-container">
      <div className="header">🧠 Free Bot</div>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`msg ${msg.role === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
