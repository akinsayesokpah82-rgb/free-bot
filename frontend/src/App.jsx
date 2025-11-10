import React, { useState, useEffect, useRef } from "react";
import "./style.css";

export default function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! I'm Free Bot, created by Akin S. Sokpah. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || window.location.origin}/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage.text }),
        }
      );

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Unable to connect. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatgpt-container">
      <header className="chatgpt-header">💬 Free Bot (GPT Style)</header>

      <div className="chatgpt-chatbox">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chatgpt-message ${
              msg.sender === "user" ? "chatgpt-user" : "chatgpt-bot"
            }`}
          >
            <div className="chatgpt-avatar">
              {msg.sender === "user" ? "🧑" : "🤖"}
            </div>
            <div className="chatgpt-text">{msg.text}</div>
          </div>
        ))}

        {loading && (
          <div className="chatgpt-message chatgpt-bot">
            <div className="chatgpt-avatar">🤖</div>
            <div className="chatgpt-text typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="chatgpt-input">
        <input
          type="text"
          placeholder="Message Free Bot..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
