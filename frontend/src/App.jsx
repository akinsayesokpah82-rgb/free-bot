import { useState } from "react";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  function newChat() {
    const newSession = { id: Date.now(), history: [] };
    setChats((c) => [newSession, ...c]);
    setMessages([]);
    setActiveChat(newSession.id);
  }

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
      setMessages((m) => [...m, botMsg]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "⚠️ Failed to connect to backend." },
      ]);
    }
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>💬 Free Bot</h2>
        <button onClick={newChat}>＋ New Chat</button>
        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={chat.id === activeChat ? "chat-item active" : "chat-item"}
              onClick={() => {
                setActiveChat(chat.id);
                setMessages(chat.history);
              }}
            >
              Chat {new Date(chat.id).toLocaleTimeString()}
            </div>
          ))}
        </div>
        <div className="footer">By Akin S. Sokpah</div>
      </aside>

      <main className="chat-area">
        <div className="chat-box">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`}>{msg.text}</div>
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
      </main>
    </div>
  );
}
