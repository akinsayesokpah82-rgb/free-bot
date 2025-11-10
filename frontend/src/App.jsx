import React, { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Welcome to Free Bot! Ask me anything." }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulated bot reply (you can connect this to your backend later)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `🤖 You said: ${userMessage.text}` }
      ]);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>💬 Free Bot</h2>
        <p>By Akin S Sokpah</p>
      </div>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
