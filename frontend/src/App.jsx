import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  // All chats
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("freebot_chats");
    return saved ? JSON.parse(saved) : [];
  });

  // Which chat is open
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");

  // Auto-save
  useEffect(() => {
    localStorage.setItem("freebot_chats", JSON.stringify(chats));
  }, [chats]);

  // Helpers
  const currentChat = chats.find((c) => c.id === currentChatId);

  const newChat = () => {
    const id = Date.now();
    const newChatObj = { id, title: "New chat", messages: [] };
    setChats([...chats, newChatObj]);
    setCurrentChatId(id);
  };

  const openChat = (id) => setCurrentChatId(id);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Update chat with user message
    const updatedChats = chats.map((chat) => {
      if (chat.id === currentChatId) {
        const updated = {
          ...chat,
          title:
            chat.title === "New chat"
              ? input.slice(0, 25) + (input.length > 25 ? "…" : "")
              : chat.title,
          messages: [...chat.messages, { role: "user", content: input }],
        };
        return updated;
      }
      return chat;
    });

    setChats(updatedChats);
    setInput("");

    // Get AI response from backend
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL || "https://free-bot-backend.onrender.com/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        }
      );
      const data = await res.json();

      // Append AI message
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: "assistant", content: data.reply || "No response" },
                ],
              }
            : chat
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="chatgpt-layout">
      {/* Sidebar */}
      <aside className="chatgpt-sidebar">
        <button onClick={newChat} className="newchat-btn">
          + New Chat
        </button>
        <div className="chat-list">
          {chats.map((c) => (
            <div
              key={c.id}
              className={`chat-item ${c.id === currentChatId ? "active" : ""}`}
              onClick={() => openChat(c.id)}
            >
              {c.title}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Window */}
      <main className="chatgpt-container">
        {currentChat ? (
          <>
            <div className="messages">
              {currentChat.messages.map((m, i) => (
                <div
                  key={i}
                  className={`message ${m.role === "user" ? "user" : "assistant"}`}
                >
                  {m.content}
                </div>
              ))}
            </div>
            <div className="input-area">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message FreeBot..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <h2>Welcome 👋</h2>
            <p>Select a chat or start a new one.</p>
          </div>
        )}
      </main>
    </div>
  );
}
