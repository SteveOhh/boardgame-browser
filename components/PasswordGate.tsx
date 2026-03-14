"use client";

import { useState, useEffect } from "react";

const PASSWORD = "gametime";
const STORAGE_KEY = "bgb-auth";

interface Props {
  children: React.ReactNode;
}

export function PasswordGate({ children }: Props) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setUnlocked(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (unlocked === null) return null; // avoid flash

  if (unlocked) return <>{children}</>;

  const attempt = () => {
    if (input === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      height: "100dvh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      flexDirection: "column",
      gap: 24,
    }}>
      <div style={{ fontSize: 48 }}>🎲</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>Game Collection</div>
        <div style={{ color: "var(--muted)", fontSize: 14 }}>Enter password to continue</div>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
        maxWidth: 280,
        animation: shake ? "shake 0.4s ease" : undefined,
      }}>
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
          }
        `}</style>

        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && attempt()}
          placeholder="Password"
          autoFocus
          style={{
            padding: "12px 16px",
            background: "var(--surface)",
            border: `1px solid ${error ? "var(--heavy)" : "var(--border)"}`,
            borderRadius: 10,
            color: "var(--text)",
            fontSize: 16,
            outline: "none",
            textAlign: "center",
            letterSpacing: "0.1em",
          }}
        />

        {error && (
          <div style={{ color: "var(--heavy)", fontSize: 13, textAlign: "center" }}>
            Wrong password
          </div>
        )}

        <button
          onClick={attempt}
          style={{
            padding: "12px",
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            border: "none",
            borderRadius: 10,
            color: "#111",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Unlock
        </button>
      </div>
    </div>
  );
}
