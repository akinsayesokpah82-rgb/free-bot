import React, { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hello! I'm Free Bot. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botReply =
        data.choices?.[0]?.message?.content ||
        "⚠️ Sorry, something went wrong. Try again later.";
      setMessages([...updatedMessages, { role: "assistant", content: botReply }]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "⚠️ Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>🤖 Free Bot <span>Created by Akin S. Sokpah</span></header>
      <main>
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <p>{m.content}</p>
          </div>
        ))}
        {loading && <div className="msg assistant"><p>Thinking...</p></div>}
      </main>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
