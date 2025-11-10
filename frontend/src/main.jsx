import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./style.css"; // ✅ Make sure this file exists
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hi! I'm Free Bot — powered by Akin S. Sokpah. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Your backend URL on Render
  const API_URL = window.location.origin + "/api/chat";

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(API_URL, { message: input });
      const botReply = res.data.reply || "Sorry, I didn’t get that.";
      setMessages([...newMessages, { role: "bot", text: botReply }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        { role: "bot", text: "⚠️ There was an error connecting to the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <h2>🤖 Free Bot</h2>
      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="message bot">✍️ Thinking...</div>}
      </div>
      <input
        type="text"
        value={input}
        placeholder="Type your message here..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
      />
      <button onClick={sendMessage}>Send</button>

      <footer style={{ marginTop: "20px", fontSize: "0.8em", opacity: 0.7 }}>
        Built by <b>Akin S. Sokpah</b> — powered by OpenAI
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
