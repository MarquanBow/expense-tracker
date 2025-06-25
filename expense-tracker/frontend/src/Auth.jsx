// src/Auth.jsx
import { useState } from "react";
import { auth } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export default function Auth({ onUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const user = auth.currentUser;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onUser(auth.currentUser); // notify App.jsx
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    onUser(null);
  };

  if (user) {
    return (
      <div className="p-4 bg-white shadow rounded mb-4">
        <p className="mb-2">🔐 Logged in as <strong>{user.email}</strong></p>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded mb-4 space-y-2">
      <h2 className="text-xl font-bold">
        {mode === "signup" ? "Sign Up" : "Log In"}
      </h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border px-2 py-1 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border px-2 py-1 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {mode === "signup" ? "Create Account" : "Login"}
      </button>
      <button
        type="button"
        onClick={() => setMode(mode === "signup" ? "login" : "signup")}
        className="text-blue-600 underline text-sm"
      >
        {mode === "signup" ? "Already have an account? Log in" : "Need an account? Sign up"}
      </button>
    </form>
  );
}
