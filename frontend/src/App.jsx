import React, { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      const botMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error connecting to server." }
      ]);
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px", maxWidth: 700, margin: "auto" }}>
      <h2>💬 Free Bot</h2>
      <p><strong>By Akin S. Sokpah</strong></p>
      <div style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        height: "400px",
        overflowY: "auto",
        background: "#fafafa"
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <strong>{m.role === "user" ? "You" : "Bot"}:</strong> {m.content}
          </div>
        ))}
        {loading && <div>⏳ Thinking...</div>}
      </div>
      <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
        <input
          style={{ flex: 1, padding: "8px" }}
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
