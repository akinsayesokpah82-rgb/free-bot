import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  push,
  onValue,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC7cAN-mrE2PvmlQ11zLKAdHBhN7nUFjHw",
  authDomain: "fir-u-c-students-web.firebaseapp.com",
  databaseURL: "https://fir-u-c-students-web-default-rtdb.firebaseio.com",
  projectId: "fir-u-c-students-web",
  storageBucket: "fir-u-c-students-web.firebasestorage.app",
  messagingSenderId: "113569186739",
  appId: "1:113569186739:web:d8daf21059f43a79e841c6",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

export default function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // monitor login state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        const messagesRef = ref(db, `users/${u.uid}/messages`);
        onValue(messagesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) setMessages(Object.values(data));
          else setMessages([]);
        });
      } else {
        setMessages([]);
      }
    });
    return () => unsub();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      alert("Sign-in error: " + e.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  // when chat sends a message
  const handleSendMessage = (msgObj) => {
    if (!user) return;
    const messagesRef = ref(db, `users/${user.uid}/messages`);
    push(messagesRef, msgObj);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Free Bot</h1>
      {!user ? (
        <button
          onClick={handleSignIn}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <img
                src={user.photoURL}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <span>{user.displayName}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm text-red-600 hover:underline"
            >
              Sign out
            </button>
          </div>
          <Chat onSend={handleSendMessage} user={user} messages={messages} />
        </div>
      )}
    </div>
  );
}
