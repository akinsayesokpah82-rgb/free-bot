import React, { useState } from "react";

export default function Chat({ history, setHistory }) {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;
    setReply("...");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    setReply(data.reply);
    setHistory([...history, { user: message, bot: data.reply }]);
    setMessage("");
  };

  return (
    <div className="flex flex-col w-full bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4">
        {history.map((h, i) => (
          <div key={i} className="mb-4">
            <p className="font-semibold">You: {h.user}</p>
            <p className="text-gray-700">Bot: {h.bot}</p>
          </div>
        ))}
      </div>
      <div className="p-4 bg-white flex">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
}
