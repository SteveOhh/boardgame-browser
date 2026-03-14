"use client";

import { useEffect } from "react";
import type { Game } from "@/lib/types";

const WEIGHT_COLOR = {
  light: "var(--light)",
  medium: "var(--medium)",
  heavy: "var(--heavy)",
  unknown: "var(--muted)",
};

interface Props {
  game: Game;
  onClose: () => void;
}

export function GameDetail({ game, onClose }: Props) {
  // Close on escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const weightColor = WEIGHT_COLOR[game.weight] || WEIGHT_COLOR.unknown;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(3px)",
          zIndex: 50,
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Sheet */}
      <div style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        background: "var(--surface)",
        borderRadius: "20px 20px 0 0",
        zIndex: 51,
        maxHeight: "85dvh",
        display: "flex",
        flexDirection: "column",
        animation: "slideUp 0.25s ease",
      }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, background: "var(--surface2)", borderRadius: 2 }} />
        </div>

        <div style={{ overflowY: "auto", padding: "0 20px 32px" }}>
          {/* Header row */}
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            {/* Art */}
            <div style={{
              width: 90, height: 90, flexShrink: 0,
              borderRadius: 10,
              overflow: "hidden",
              background: "var(--surface2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {game.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={game.image} alt={game.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 40 }}>🎲</span>
              )}
            </div>

            {/* Title + meta */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2, marginBottom: 6 }}>{game.name}</h2>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Badge color={weightColor} label={game.weight} />
                {game.players && <Badge color="var(--muted)" label={`👥 ${game.players}`} />}
                {game.time_min && <Badge color="var(--muted)" label={`⏱ ${game.time_min} min`} />}
                {game.yearpublished && <Badge color="var(--muted)" label={String(game.yearpublished)} />}
              </div>
            </div>
          </div>

          {/* Owners + ratings */}
          {game.owners.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
                Owner{game.owners.length > 1 ? "s" : ""}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {game.owners.map((o) => (
                  <div key={o} style={{
                    background: "var(--surface2)", borderRadius: 10,
                    padding: "8px 12px",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ fontSize: 16 }}>👤</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{o}</div>
                      {game.ratings[o] !== undefined && (
                        <div style={{ fontSize: 11, color: "var(--accent)", marginTop: 1 }}>
                          {"★".repeat(Math.round(game.ratings[o] / 2))}{"☆".repeat(5 - Math.round(game.ratings[o] / 2))} {game.ratings[o]}/10
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plays */}
          {game.numplays && game.numplays > 0 ? (
            <div style={{
              background: "var(--surface2)", borderRadius: 10,
              padding: "10px 14px", marginBottom: 14,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 18 }}>▶️</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Played {game.numplays} time{game.numplays !== 1 ? "s" : ""}</div>
              </div>
            </div>
          ) : null}

          {/* Notes */}
          {game.notes && (
            <div style={{
              background: "var(--surface2)", borderRadius: 10,
              padding: "10px 14px", marginBottom: 14,
              borderLeft: "3px solid var(--accent)",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Notes</div>
              <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>{game.notes}</div>
            </div>
          )}

          {/* Description */}
          {game.description && (
            <p style={{ color: "#bbb", fontSize: 14, lineHeight: 1.6, marginBottom: 14 }}>
              {game.description}
            </p>
          )}

          {/* Tags */}
          {game.tags.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
                Categories & Mechanics
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {game.tags.map((t) => (
                  <span key={t} style={{
                    fontSize: 12, padding: "3px 9px",
                    background: "var(--surface2)", borderRadius: 20,
                    color: "#ccc",
                  }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Publisher */}
          {game.publisher && (
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
              Published by {game.publisher}
            </div>
          )}

          {/* BGG link */}
          {game.bgg_id && (
            <a
              href={`https://boardgamegeek.com/boardgame/${game.bgg_id}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "12px",
                background: "var(--surface2)",
                borderRadius: 10,
                color: "var(--accent)",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              View on BoardGameGeek ↗
            </a>
          )}
        </div>
      </div>
    </>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 11, padding: "2px 8px",
      background: color + "22", borderRadius: 20,
      color, fontWeight: 600, textTransform: "capitalize",
    }}>
      {label}
    </span>
  );
}
