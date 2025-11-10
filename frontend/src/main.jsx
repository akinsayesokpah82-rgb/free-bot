import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import axios from "axios";

function App() {
  const [chats, setChats] = useState([{ id: 1, title: "New Chat", messages: [] }]);
  const [activeChat, setActiveChat] = useState(1);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = window.location.origin + "/api/chat";

  const currentChat = chats.find(c => c.id === activeChat);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = { role: "user", text: input };
    const updatedChats = chats.map(c =>
      c.id === activeChat ? { ...c, messages: [...c.messages, newMsg] } : c
    );
    setChats(updatedChats);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(API_URL, { message: input });
      const botReply = res.data.reply || "Sorry, I didn’t get that.";
      const withReply = updatedChats.map(c =>
        c.id === activeChat
          ? { ...c, messages: [...c.messages, { role: "bot", text: botReply }] }
          : c
      );
      setChats(withReply);
    } catch (err) {
      console.error(err);
      const errChat = updatedChats.map(c =>
        c.id === activeChat
          ? { ...c, messages: [...c.messages, { role: "bot", text: "⚠️ Error connecting to server." }] }
          : c
      );
      setChats(errChat);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => {
    if (e.key === "Enter") sendMessage();
  };

  const newChat = () => {
    const id = chats.length + 1;
    setChats([...chats, { id, title: `Chat ${id}`, messages: [] }]);
    setActiveChat(id);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h3>💬 Free Bot</h3>
        <button className="new-chat-btn" onClick={newChat}>＋ New Chat</button>
        <div className="chat-list">
          {chats.map(c => (
            <div
              key={c.id}
              className={`chat-item ${c.id === activeChat ? "active" : ""}`}
              onClick={() => setActiveChat(c.id)}
            >
              {c.title}
            </div>
          ))}
        </div>
        <footer>By <b>Akin S. Sokpah</b></footer>
      </aside>

      <main className="chat-area">
        <div className="chat-box">
          {currentChat.messages.length === 0 && (
            <div className="message bot">
              👋 Hi! I'm Free Bot — your AI assistant. Ask me anything!
            </div>
          )}
          {currentChat.messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              {m.text}
            </div>
          ))}
          {loading && <div className="message bot">✍️ Thinking...</div>}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
