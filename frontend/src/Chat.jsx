import React, { useState, useEffect } from "react";

export default function Chat({ onSend, user, messages }) {
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input, time: Date.now() };
    onSend(newMessage);

    // show user message instantly
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();
    const botMessage = { sender: "bot", text: data.reply, time: Date.now() };
    onSend(botMessage);

    setInput("");
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <div className="h-96 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div key={i} className={m.sender === "user" ? "text-right" : "text-left"}>
            <p
              className={
                m.sender === "user"
                  ? "inline-block bg-blue-500 text-white px-3 py-2 rounded-lg mb-2"
                  : "inline-block bg-gray-200 px-3 py-2 rounded-lg mb-2"
              }
            >
              {m.text}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow border p-2 rounded"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}
