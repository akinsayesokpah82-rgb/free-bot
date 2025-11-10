import React from 'react';
import Chat from './Chat';

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, Arial', maxWidth: 860, margin: '24px auto', padding: 16 }}>
      <header style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>Free Bot</h1>
        <div style={{ fontSize: 13, color: '#555' }}>Created by Akin S. Sokpah</div>
      </header>

      <main>
        <Chat />
      </main>

      <footer style={{ marginTop: 24, fontSize: 12, color: '#777' }}>
        <div>Built to prototype a secure OpenAI-powered assistant. Keep your OpenAI key safe on the server.</div>
      </footer>
    </div>
  );
}
