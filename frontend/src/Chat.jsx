import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are Free Bot — helpful, concise assistant created by Akin S. Sokpah.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const panelRef = useRef();

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const resp = await axios.post('/api/chat', { messages: newMessages });
      // OpenAI chat completions return choices[].message
      const assistant = resp.data?.choices?.[0]?.message;
      if (assistant) {
        setMessages(prev => [...prev, assistant]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'No response (empty).' }]);
      }
      // scroll
      setTimeout(() => panelRef.current?.scrollTo({ top: panelRef.current.scrollHeight, behavior: 'smooth' }), 50);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: failed to fetch response from server.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send();
  }

  return (
    <div>
      <section ref={panelRef} style={{ height: 520, overflow: 'auto', border: '1px solid #eee', padding: 12, borderRadius: 8, background: '#fafafa' }}>
        {messages.filter(m => m.role !== 'system').map((m, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#666' }}>{m.role === 'user' ? 'You' : 'Free Bot'}</div>
            <div style={{ padding: '8px 10px', borderRadius: 6, background: m.role === 'user' ? '#e6f7ff' : '#fff' }}>
              {m.content}
            </div>
          </div>
        ))}
      </section>

      <div style={{ marginTop: 12 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your message. Press Ctrl+Enter or Cmd+Enter to send."
          rows={4}
          style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <div style={{ fontSize: 12, color: '#666' }}>{loading ? 'Thinking...' : 'Ready'}</div>
          <div>
            <button onClick={send} disabled={loading || !input.trim()} style={{ padding: '8px 12px', borderRadius: 6, background: '#0b74ff', color: '#fff', border: 'none' }}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
