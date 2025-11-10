import React, { useState } from "react";
import Chat from "./Chat";
import Sidebar from "./Sidebar";

export default function App() {
  const [history, setHistory] = useState([]);

  return (
    <div className="flex h-screen">
      <Sidebar history={history} />
      <Chat history={history} setHistory={setHistory} />
    </div>
  );
}
