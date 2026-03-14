"use client";

import { useEffect } from "react";
import type { Filters, WeightFilter } from "@/lib/types";

interface Props {
  filters: Filters;
  topTags: string[];
  owners: string[];
  onChange: (f: Filters) => void;
  onClose: () => void;
  onReset: () => void;
  totalMatches: number;
}

const PLAYER_OPTIONS = [1, 2, 3, 4, 5, 6];
const TIME_OPTIONS = [
  { label: "Any", value: null },
  { label: "≤30m", value: 30 },
  { label: "≤60m", value: 60 },
  { label: "≤90m", value: 90 },
  { label: "≤2h", value: 120 },
];
const WEIGHT_OPTIONS: { label: string; value: WeightFilter }[] = [
  { label: "All", value: "all" },
  { label: "🟢 Light", value: "light" },
  { label: "🟡 Medium", value: "medium" },
  { label: "🔴 Heavy", value: "heavy" },
];

export function FilterPanel({ filters, topTags, owners, onChange, onClose, onReset, totalMatches }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const toggleTag = (tag: string) => {
    onChange({
      ...filters,
      tags: filters.tags.includes(tag)
        ? filters.tags.filter((t) => t !== tag)
        : [...filters.tags, tag],
    });
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(3px)",
        zIndex: 50, animation: "fadeIn 0.2s ease",
      }} />

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "var(--surface)",
        borderRadius: "20px 20px 0 0",
        zIndex: 51,
        maxHeight: "88dvh",
        display: "flex", flexDirection: "column",
        animation: "slideUp 0.25s ease",
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, background: "var(--surface2)", borderRadius: 2 }} />
        </div>

        {/* Header */}
        <div style={{
          padding: "4px 20px 12px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
        }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Filters</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={onReset} style={{
              background: "none", border: "none", color: "var(--muted)", fontSize: 13,
            }}>Reset</button>
            <button
              onClick={onClose}
              style={{
                background: "var(--accent)",
                border: "none", borderRadius: 20,
                padding: "6px 16px",
                color: "#111", fontWeight: 700, fontSize: 13,
              }}
            >
              Show {totalMatches}
            </button>
          </div>
        </div>

        <div style={{ overflowY: "auto", padding: "16px 20px 40px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Weight */}
          <Section title="Complexity">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {WEIGHT_OPTIONS.map((w) => (
                <ToggleChip
                  key={w.value}
                  label={w.label}
                  active={filters.weight === w.value}
                  onClick={() => onChange({ ...filters, weight: w.value })}
                />
              ))}
            </div>
          </Section>

          {/* Player count */}
          <Section title="Players">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <ToggleChip
                label="Any"
                active={filters.players === null}
                onClick={() => onChange({ ...filters, players: null })}
              />
              {PLAYER_OPTIONS.map((n) => (
                <ToggleChip
                  key={n}
                  label={String(n)}
                  active={filters.players === n}
                  onClick={() => onChange({ ...filters, players: filters.players === n ? null : n })}
                />
              ))}
            </div>
          </Section>

          {/* Play time */}
          <Section title="Min Play Time (optimistic — actual may be longer)">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TIME_OPTIONS.map((t) => (
                <ToggleChip
                  key={t.label}
                  label={t.label}
                  active={filters.maxTime === t.value}
                  onClick={() => onChange({ ...filters, maxTime: t.value })}
                />
              ))}
            </div>
          </Section>

          {/* Played only */}
          <Section title="Status">
            <ToggleChip
              label="▶ Played before"
              active={filters.playedOnly}
              onClick={() => onChange({ ...filters, playedOnly: !filters.playedOnly })}
            />
          </Section>

          {/* Owner */}
          {owners.length > 0 && (
            <Section title="Owner">
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <ToggleChip
                  label="Anyone"
                  active={filters.owner === null}
                  onClick={() => onChange({ ...filters, owner: null })}
                />
                {owners.map((o) => (
                  <ToggleChip
                    key={o}
                    label={o}
                    active={filters.owner === o}
                    onClick={() => onChange({ ...filters, owner: filters.owner === o ? null : o })}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Tags */}
          <Section title="Tags">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {topTags.map((tag) => (
                <ToggleChip
                  key={tag}
                  label={tag}
                  active={filters.tags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                />
              ))}
            </div>
          </Section>

        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, color: "var(--muted)",
        textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8,
      }}>{title}</div>
      {children}
    </div>
  );
}

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: 20,
        border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
        background: active ? "var(--accent)" : "var(--surface2)",
        color: active ? "#111" : "var(--text)",
        fontWeight: active ? 700 : 400,
        fontSize: 13,
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}
