// Client-safe utilities (no fs imports)
import type { Game } from "./types";

export function getOwners(games: Game[]): string[] {
  const s = new Set<string>();
  for (const g of games) for (const o of g.owners) s.add(o);
  return Array.from(s).sort();
}

export function supportsPlayerCount(players: string | undefined, n: number): boolean {
  if (!players) return true;
  const clean = players.replace(/[–—-]/g, "-");
  const match = clean.match(/(\d+)-(\d+)/);
  if (match) {
    return n >= parseInt(match[1]) && n <= parseInt(match[2]);
  }
  const exact = parseInt(clean);
  return !isNaN(exact) && exact === n;
}

export function getTopTags(games: Game[], limit = 20): string[] {
  const counts: Record<string, number> = {};
  for (const g of games) {
    for (const t of g.tags) {
      counts[t] = (counts[t] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([t]) => t);
}
