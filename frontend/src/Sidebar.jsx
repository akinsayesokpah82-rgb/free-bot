import React from "react";

export default function Sidebar({ history }) {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-4">💬 Free Bot</h1>
      <button className="bg-blue-600 py-2 rounded mb-4">＋ New Chat</button>
      <h2 className="text-sm text-gray-400 mb-2">Chat History</h2>
      <div className="flex-1 overflow-y-auto space-y-2">
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm">No chats yet</p>
        ) : (
          history.map((h, i) => (
            <div key={i} className="text-sm bg-gray-800 p-2 rounded">
              {h.user.slice(0, 20)}
            </div>
          ))
        )}
      </div>
      <p className="mt-4 text-xs text-gray-500">By Akin S. Sokpah</p>
    </div>
  );
}
