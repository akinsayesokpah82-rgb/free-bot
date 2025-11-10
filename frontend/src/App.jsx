import React from 'react';
import Chat from './Chat';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1 className="title">Free Bot</h1>
          <div className="subtitle">Created by Akin S. Sokpah</div>
        </div>
      </header>

      <main className="app-main">
        <Chat />
      </main>

      <footer className="app-footer">
        Built to prototype a secure OpenAI-powered assistant. Keep your OpenAI key safe on the server.
      </footer>
    </div>
  );
}
