"use client";

import { useState, useMemo, useEffect } from "react";
import type { Game } from "@/lib/types";
import { supportsPlayerCount } from "@/lib/utils";

interface Props {
  games: Game[];
  onClose: () => void;
  onSelect: (game: Game) => void;
}

type Weight = "any" | "light" | "medium" | "heavy";

export function PickTonight({ games, onClose, onSelect }: Props) {
  const [players, setPlayers] = useState<number>(2);
  const [weight, setWeight] = useState<Weight>("any");
  const [maxTime, setMaxTime] = useState<number>(120);
  const [result, setResult] = useState<Game | null>(null);
  const [rolling, setRolling] = useState(false);
  const [rollNames, setRollNames] = useState<string[]>([]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const pool = useMemo(() => {
    return games.filter((g) => {
      if (!supportsPlayerCount(g.players, players)) return false;
      if (weight !== "any" && g.weight !== weight) return false;
      if (g.time_min && g.time_min > maxTime) return false;
      return true;
    });
  }, [games, players, weight, maxTime]);

  const roll = () => {
    if (pool.length === 0) return;
    setResult(null);
    setRolling(true);

    // Animate through random names
    let count = 0;
    const total = 16;
    const interval = setInterval(() => {
      const random = pool[Math.floor(Math.random() * pool.length)];
      setRollNames([random.name]);
      count++;
      if (count >= total) {
        clearInterval(interval);
        const winner = pool[Math.floor(Math.random() * pool.length)];
        setResult(winner);
        setRolling(false);
      }
    }, 80);
  };

  const WEIGHT_OPTIONS: { label: string; value: Weight }[] = [
    { label: "Any", value: "any" },
    { label: "🟢 Light", value: "light" },
    { label: "🟡 Medium", value: "medium" },
    { label: "🔴 Heavy", value: "heavy" },
  ];

  const TIME_OPTIONS = [
    { label: "30m", value: 30 },
    { label: "1h", value: 60 },
    { label: "90m", value: 90 },
    { label: "2h", value: 120 },
    { label: "Any", value: 999 },
  ];

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
        zIndex: 50, animation: "fadeIn 0.2s ease",
      }} />

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "var(--surface)",
        borderRadius: "20px 20px 0 0",
        zIndex: 51,
        maxHeight: "90dvh",
        display: "flex", flexDirection: "column",
        animation: "slideUp 0.25s ease",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, background: "var(--surface2)", borderRadius: 2 }} />
        </div>

        <div style={{ overflowY: "auto", padding: "4px 20px 40px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🎯 Pick Tonight</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20 }}>
            Set your constraints and let fate decide.
          </p>

          {/* Players */}
          <div style={{ marginBottom: 18 }}>
            <Label>Players</Label>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setPlayers(n)}
                  style={{
                    width: 42, height: 42,
                    borderRadius: 10,
                    border: `2px solid ${players === n ? "var(--accent)" : "var(--border)"}`,
                    background: players === n ? "var(--accent)" : "var(--surface2)",
                    color: players === n ? "#111" : "var(--text)",
                    fontWeight: 700, fontSize: 15,
                  }}
                >{n}</button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div style={{ marginBottom: 18 }}>
            <Label>Complexity</Label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {WEIGHT_OPTIONS.map((w) => (
                <button
                  key={w.value}
                  onClick={() => setWeight(w.value)}
                  style={{
                    padding: "7px 14px", borderRadius: 20,
                    border: `1px solid ${weight === w.value ? "var(--accent)" : "var(--border)"}`,
                    background: weight === w.value ? "var(--accent)" : "var(--surface2)",
                    color: weight === w.value ? "#111" : "var(--text)",
                    fontWeight: weight === w.value ? 700 : 400, fontSize: 13,
                  }}
                >{w.label}</button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div style={{ marginBottom: 24 }}>
            <Label>Starts within (min play time — actual may be longer)</Label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TIME_OPTIONS.map((t) => (
                <button
                  key={t.label}
                  onClick={() => setMaxTime(t.value)}
                  style={{
                    padding: "7px 14px", borderRadius: 20,
                    border: `1px solid ${maxTime === t.value ? "var(--accent)" : "var(--border)"}`,
                    background: maxTime === t.value ? "var(--accent)" : "var(--surface2)",
                    color: maxTime === t.value ? "#111" : "var(--text)",
                    fontWeight: maxTime === t.value ? 700 : 400, fontSize: 13,
                  }}
                >{t.label}</button>
              ))}
            </div>
          </div>

          {/* Pool size */}
          <div style={{
            padding: "10px 14px",
            background: "var(--surface2)",
            borderRadius: 10,
            fontSize: 13,
            color: pool.length > 0 ? "var(--text)" : "var(--heavy)",
            marginBottom: 16,
          }}>
            {pool.length > 0
              ? `${pool.length} game${pool.length !== 1 ? "s" : ""} match your criteria`
              : "No games match — try loosening your filters"}
          </div>

          {/* Roll result */}
          {(rolling || result) && (
            <div style={{
              padding: "20px 16px",
              background: "var(--surface2)",
              borderRadius: 14,
              marginBottom: 16,
              textAlign: "center",
              minHeight: 100,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 8,
            }}>
              {rolling ? (
                <>
                  <div style={{ fontSize: 28 }}>🎲</div>
                  <div style={{
                    fontSize: 16, fontWeight: 600,
                    color: "var(--accent)",
                    transition: "all 0.05s",
                    maxWidth: "100%",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {rollNames[0] || "…"}
                  </div>
                </>
              ) : result ? (
                <>
                  <div style={{ fontSize: 32 }}>🎉</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{result.name}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", fontSize: 12, color: "var(--muted)" }}>
                    {result.players && <span>👥 {result.players}</span>}
                    {result.time_min && <span>⏱ {result.time_min} min</span>}
                    <span style={{ textTransform: "capitalize" }}>{result.weight}</span>
                  </div>
                  <button
                    onClick={() => onSelect(result)}
                    style={{
                      marginTop: 8,
                      padding: "8px 20px",
                      background: "var(--accent)",
                      border: "none", borderRadius: 20,
                      color: "#111", fontWeight: 700, fontSize: 14,
                    }}
                  >
                    View Details
                  </button>
                </>
              ) : null}
            </div>
          )}

          {/* Roll button */}
          <button
            onClick={roll}
            disabled={pool.length === 0 || rolling}
            style={{
              width: "100%",
              padding: "14px",
              background: pool.length === 0 || rolling
                ? "var(--surface2)"
                : "linear-gradient(135deg, var(--accent), var(--accent2))",
              border: "none", borderRadius: 14,
              color: pool.length === 0 || rolling ? "var(--muted)" : "#111",
              fontWeight: 700, fontSize: 16,
              transition: "opacity 0.2s",
            }}
          >
            {rolling ? "Rolling…" : result ? "🎲 Roll Again" : "🎲 Roll"}
          </button>
        </div>
      </div>
    </>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: "var(--muted)",
      textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8,
    }}>{children}</div>
  );
}
