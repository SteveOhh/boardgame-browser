"use client";

import type { Game } from "@/lib/types";

const WEIGHT_COLOR = {
  light: "var(--light)",
  medium: "var(--medium)",
  heavy: "var(--heavy)",
  unknown: "var(--muted)",
};

const WEIGHT_BG = {
  light: "#4ade8018",
  medium: "#f5a62318",
  heavy: "#f8717118",
  unknown: "#88888818",
};

interface Props {
  game: Game;
  onClick: () => void;
}

export function GameCard({ game, onClick }: Props) {
  const weightColor = WEIGHT_COLOR[game.weight] || WEIGHT_COLOR.unknown;
  const weightBg = WEIGHT_BG[game.weight] || WEIGHT_BG.unknown;

  return (
    <button
      onClick={onClick}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        cursor: "pointer",
        textAlign: "left",
        transition: "transform 0.15s, border-color 0.15s",
        display: "flex",
        flexDirection: "column",
      }}
      onTouchStart={(e) => e.currentTarget.style.transform = "scale(0.97)"}
      onTouchEnd={(e) => e.currentTarget.style.transform = "scale(1)"}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Box art / placeholder */}
      <div style={{
        width: "100%",
        aspectRatio: "1",
        background: game.image ? "transparent" : weightBg,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {game.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.image}
            alt={game.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <span style={{
            fontSize: "clamp(24px, 6vw, 40px)",
            opacity: 0.6,
          }}>
            🎲
          </span>
        )}

        {/* Plays badge */}
        {game.numplays && game.numplays > 0 ? (
          <div style={{
            position: "absolute", top: 6, right: 6,
            background: "rgba(0,0,0,0.75)", borderRadius: 20,
            padding: "2px 6px", fontSize: 10, color: "#fff", fontWeight: 600,
          }}>
            ▶ {game.numplays}×
          </div>
        ) : null}

        {/* Shared ownership badge */}
        {game.owners.length > 1 && (
          <div style={{
            position: "absolute", top: 6, left: 6,
            background: "rgba(0,0,0,0.75)", borderRadius: 20,
            padding: "2px 6px", fontSize: 10, color: "#fff",
          }}>
            👥
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "8px 9px 9px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{
          fontWeight: 600,
          fontSize: 12,
          lineHeight: 1.3,
          color: "var(--text)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {game.name}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap", marginTop: "auto" }}>
          {/* Weight */}
          <span style={{
            fontSize: 10,
            padding: "1px 6px",
            borderRadius: 20,
            background: weightBg,
            color: weightColor,
            fontWeight: 600,
            textTransform: "capitalize",
          }}>
            {game.weight}
          </span>

          {/* Time */}
          {game.time_min && (
            <span style={{ fontSize: 10, color: "var(--muted)" }}>
              {game.time_min}m
            </span>
          )}

          {/* Players */}
          {game.players && (
            <span style={{ fontSize: 10, color: "var(--muted)", marginLeft: "auto" }}>
              👥{game.players}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
