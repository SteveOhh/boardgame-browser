"use client";

import { useState, useMemo, useCallback } from "react";
import type { Game, Filters, WeightFilter } from "@/lib/types";
import { supportsPlayerCount } from "@/lib/utils";
import { GameCard } from "./GameCard";
import { GameDetail } from "./GameDetail";
import { FilterPanel } from "./FilterPanel";
import { PickTonight } from "./PickTonight";

const DEFAULT_FILTERS: Filters = {
  search: "",
  weight: "all",
  players: null,
  maxTime: null,
  tags: [],
  playedOnly: false,
  owner: null,
};

function applyFilters(games: Game[], f: Filters): Game[] {
  return games.filter((g) => {
    if (f.search) {
      const q = f.search.toLowerCase();
      const hit =
        g.name.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q)) ||
        g.publisher?.toLowerCase().includes(q) ||
        g.notes?.toLowerCase().includes(q) ||
        g.owners.some((o) => o.toLowerCase().includes(q));
      if (!hit) return false;
    }
    if (f.weight !== "all" && g.weight !== f.weight) return false;
    if (f.players !== null && !supportsPlayerCount(g.players, f.players)) return false;
    if (f.maxTime !== null && g.time_min && g.time_min > f.maxTime) return false;
    if (f.tags.length > 0 && !f.tags.every((t) => g.tags.includes(t))) return false;
    if (f.playedOnly && (!g.numplays || g.numplays === 0)) return false;
    if (f.owner && !g.owners.includes(f.owner)) return false;
    return true;
  });
}

interface Props {
  games: Game[];
  topTags: string[];
  owners: string[];
}

export function GameBrowser({ games, topTags, owners }: Props) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<Game | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPick, setShowPick] = useState(false);
  const [sort, setSort] = useState<"name" | "year" | "time" | "plays">("name");

  const filtered = useMemo(() => {
    const f = applyFilters(games, filters);
    return [...f].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "year") return (b.yearpublished || 0) - (a.yearpublished || 0);
      if (sort === "time") return (a.time_min || 999) - (b.time_min || 999);
      if (sort === "plays") return (b.numplays || 0) - (a.numplays || 0);
      return 0;
    });
  }, [games, filters, sort]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.weight !== "all") n++;
    if (filters.players !== null) n++;
    if (filters.maxTime !== null) n++;
    if (filters.tags.length) n += filters.tags.length;
    if (filters.playedOnly) n++;
    if (filters.owner) n++;
    return n;
  }, [filters]);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden" }}>
      {/* Top bar */}
      <header style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--bg)",
        flexShrink: 0,
        zIndex: 10,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.1 }}>🎲 Game Collection</div>
          <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 1 }}>
            {filtered.length} of {games.length} games
          </div>
        </div>

        {/* Pick Tonight */}
        <button
          onClick={() => setShowPick(true)}
          style={{
            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
            border: "none",
            borderRadius: 20,
            padding: "7px 14px",
            color: "#111",
            fontWeight: 700,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 5,
            whiteSpace: "nowrap",
          }}
        >
          🎯 Pick Tonight
        </button>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(true)}
          style={{
            background: activeFilterCount > 0 ? "var(--accent)" : "var(--surface2)",
            border: "none",
            borderRadius: 20,
            padding: "7px 12px",
            color: activeFilterCount > 0 ? "#111" : "var(--text)",
            fontWeight: 600,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          ⚙ {activeFilterCount > 0 ? activeFilterCount : ""}
        </button>
      </header>

      {/* Search + sort bar */}
      <div style={{
        padding: "10px 16px",
        display: "flex",
        gap: 8,
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        flexShrink: 0,
      }}>
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{
            position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
            color: "var(--muted)", fontSize: 14, pointerEvents: "none",
          }}>⌕</span>
          <input
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Search games, tags, publishers…"
            style={{
              width: "100%",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "8px 10px 8px 30px",
              color: "var(--text)",
              fontSize: 14,
              outline: "none",
            }}
          />
          {filters.search && (
            <button
              onClick={() => setFilters((f) => ({ ...f, search: "" }))}
              style={{
                position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "var(--muted)", fontSize: 14,
              }}
            >✕</button>
          )}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "8px 10px",
            color: "var(--text)",
            fontSize: 13,
            outline: "none",
          }}
        >
          <option value="name">A–Z</option>
          <option value="year">Newest</option>
          <option value="time">Quickest</option>
          <option value="plays">Most Played</option>
        </select>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div style={{
          padding: "8px 16px",
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
          flexShrink: 0,
        }}>
          {filters.weight !== "all" && (
            <Chip label={`Weight: ${filters.weight}`} onRemove={() => setFilters(f => ({ ...f, weight: "all" }))} />
          )}
          {filters.players !== null && (
            <Chip label={`${filters.players} players`} onRemove={() => setFilters(f => ({ ...f, players: null }))} />
          )}
          {filters.maxTime !== null && (
            <Chip label={`starts ≤${filters.maxTime} min`} onRemove={() => setFilters(f => ({ ...f, maxTime: null }))} />
          )}
          {filters.tags.map(t => (
            <Chip key={t} label={t} onRemove={() => setFilters(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))} />
          ))}
          {filters.playedOnly && (
            <Chip label="Played only" onRemove={() => setFilters(f => ({ ...f, playedOnly: false }))} />
          )}
          {filters.owner && (
            <Chip label={`Owner: ${filters.owner}`} onRemove={() => setFilters(f => ({ ...f, owner: null }))} />
          )}
          <button
            onClick={resetFilters}
            style={{ fontSize: 11, color: "var(--muted)", background: "none", border: "none", padding: "0 4px" }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Game grid */}
      <main style={{ flex: 1, overflowY: "auto", padding: "12px 12px 80px" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎲</div>
            <div>No games match these filters</div>
            <button onClick={resetFilters} style={{
              marginTop: 12, padding: "8px 16px", background: "var(--surface2)",
              border: "none", borderRadius: 8, color: "var(--text)", fontSize: 13,
            }}>Clear filters</button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: 10,
          }}>
            {filtered.map((game) => (
              <GameCard key={game.game_id} game={game} onClick={() => setSelected(game)} />
            ))}
          </div>
        )}
      </main>

      {/* Overlays */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          topTags={topTags}
          owners={owners}
          onChange={setFilters}
          onClose={() => setShowFilters(false)}
          onReset={resetFilters}
          totalMatches={filtered.length}
        />
      )}

      {selected && (
        <GameDetail game={selected} onClose={() => setSelected(null)} />
      )}

      {showPick && (
        <PickTonight
          games={games}
          onClose={() => setShowPick(false)}
          onSelect={(g) => { setSelected(g); setShowPick(false); }}
        />
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "3px 8px 3px 10px",
      background: "var(--surface2)",
      borderRadius: 20,
      fontSize: 12,
      color: "var(--text)",
    }}>
      {label}
      <button onClick={onRemove} style={{
        background: "none", border: "none", color: "var(--muted)",
        fontSize: 13, lineHeight: 1, padding: "0 2px",
      }}>×</button>
    </span>
  );
}
