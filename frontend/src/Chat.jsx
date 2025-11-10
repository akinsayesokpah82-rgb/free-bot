import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

// Firebase modular imports
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getDatabase,
  ref as dbRef,
  push,
  onValue,
  set,
  query,
  orderByChild
} from 'firebase/database';

/*
  Paste your Firebase config here (you provided it earlier).
  This config can be public on the client side (apiKey is ok here).
*/
const firebaseConfig = {
  apiKey: "AIzaSyC7cAN-mrE2PvmlQ11zLKAdHBhN7nUFjHw",
  authDomain: "fir-u-c-students-web.firebaseapp.com",
  databaseURL: "https://fir-u-c-students-web-default-rtdb.firebaseio.com",
  projectId: "fir-u-c-students-web",
  storageBucket: "fir-u-c-students-web.firebasestorage.app",
  messagingSenderId: "113569186739",
  appId: "1:113569186739:web:d8daf21059f43a79e841c6"
};

// Initialize Firebase app + services (safe to call multiple times)
let firebaseApp;
try {
  firebaseApp = initializeApp(firebaseConfig);
} catch (e) {
  // initializeApp throws if already initialized; ignore.
  console.warn('Firebase init warning', e.message);
}
const auth = getAuth();
const provider = new GoogleAuthProvider();
const database = getDatabase();

export default function Chat() {
  const [user, setUser] = useState(null); // firebase user
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are Free Bot — helpful assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const panelRef = useRef();

  // track auth changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        loadUserMessages(u.uid);
      } else {
        setUser(null);
        // keep default messages (no DB)
      }
    });
    return () => unsub();
  }, []);

  // load messages from realtime database for this uid
  function loadUserMessages(uid) {
    try {
      const messagesRef = dbRef(database, `users/${uid}/messages`);
      // Listen once and update (we use realtime listening)
      onValue(messagesRef, (snapshot) => {
        const val = snapshot.val();
        if (!val) {
          setMessages(prev => prev.filter(m => m.role === 'system')); // reset to system only
          return;
        }
        // val is an object keyed by push keys; convert to array sorted by push order
        const arr = Object.values(val).map(m => ({ role: m.role, content: m.content, ts: m.ts }));
        // Sort by ts if present
        arr.sort((a, b) => (a.ts || 0) - (b.ts || 0));
        // Prepend system prompt
        const sys = { role: 'system', content: 'You are Free Bot — helpful assistant.' };
        setMessages([sys, ...arr]);
      }, { onlyOnce: false });
    } catch (err) {
      console.error('loadUserMessages error', err);
    }
  }

  // save message for signed-in user
  async function saveMessageToDB(uid, msg) {
    try {
      const messagesRef = dbRef(database, `users/${uid}/messages`);
      // push new message
      const record = { role: msg.role, content: msg.content, ts: Date.now() };
      await push(messagesRef, record);
    } catch (err) {
      console.error('saveMessageToDB error', err);
    }
  }

  async function handleSend() {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input.trim(), ts: Date.now() };
    const newMessages = [...messages.filter(m => m.role !== 'system'), userMsg]; // retain system as separate
    // Add to the UI immediately
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // If logged in, save user message to DB
    if (user) {
      saveMessageToDB(user.uid, userMsg);
    }

    try {
      // send messages to backend chat endpoint, include system as first
      const payloadMessages = [...messages.filter(m => m.role === 'system'), ...newMessages];
      const resp = await axios.post('/api/chat', {
        messages: payloadMessages
      }, { timeout: 60000 });

      const assistant = resp.data?.choices?.[0]?.message || { role: 'assistant', content: 'No response.' };

      // Append assistant to UI and DB if logged in
      setMessages(prev => [...prev, assistant]);
      if (user) {
        saveMessageToDB(user.uid, assistant);
      }

      // autoscroll
      setTimeout(() => panelRef.current?.scrollTo({ top: panelRef.current.scrollHeight, behavior: 'smooth' }), 50);
    } catch (err) {
      console.error('chat error', err?.response || err?.message || err);
      const errMsg = { role: 'assistant', content: 'Error: failed to fetch response from server.' };
      setMessages(prev => [...prev, errMsg]);
      if (user) saveMessageToDB(user.uid, errMsg);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend();
  }

  async function loginWithGoogle() {
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will fire and load messages
    } catch (err) {
      console.error('google login error', err);
      alert('Google sign-in failed. Check console for details.');
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setMessages([{ role: 'system', content: 'You are Free Bot — helpful assistant.' }]);
      setUser(null);
    } catch (err) {
      console.error('signout error', err);
    }
  }

  return (
    <div className="chat-wrap">
      <div className="chat-topbar">
        <div className="brand">
          <div className="logo">🤖</div>
          <div>
            <div className="brand-title">Free Bot</div>
            <div className="brand-sub">Created by Akin S. Sokpah</div>
          </div>
        </div>

        <div className="auth-area">
          {user ? (
            <>
              <div className="user-info">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName||user.email)}`} alt="avatar" className="avatar"/>
                <div className="user-name">{user.displayName || user.email}</div>
              </div>
              <button className="btn ghost" onClick={logout}>Sign out</button>
            </>
          ) : (
            <button className="btn primary" onClick={loginWithGoogle}>Sign in with Google</button>
          )}
        </div>
      </div>

      <section className="panel" ref={panelRef}>
        {messages.filter(m => m.role !== 'system').map((m, i) => (
          <div key={i} className={`bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-bot'}`}>
            <div className="bubble-role">{m.role === 'user' ? (user && m.role === 'user' ? 'You' : 'You') : 'Free Bot'}</div>
            <div className="bubble-content">{m.content}</div>
          </div>
        ))}
      </section>

      <div className="composer">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={user ? "Ask Free Bot something..." : "Sign in to save your chat. Ask Free Bot something..."}
          rows={3}
        />
        <div className="composer-controls">
          <div className="status">{loading ? 'Thinking...' : 'Ready'}</div>
          <div>
            <button className="btn secondary" onClick={() => { setInput(''); }}>Clear</button>
            <button className="btn primary" onClick={handleSend} disabled={loading || !input.trim()}>
              {loading ? 'Sending…' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
