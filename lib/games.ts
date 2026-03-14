// Server-only: reads files from disk at build time
import fs from "fs";
import path from "path";
import type { Game } from "./types";

const GAMES_PATH = path.join(process.cwd(), "data/games.jsonl");

const IMAGES_PATH = path.join(process.cwd(), "data/images.json");

export function loadGames(): Game[] {
  const raw = fs
    .readFileSync(GAMES_PATH, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));

  let images: Record<string, string> = {};
  try {
    images = JSON.parse(fs.readFileSync(IMAGES_PATH, "utf-8"));
  } catch {}

  return raw.map((g) => ({
    game_id: g.game_id,
    name: g.name,
    description: g.description,
    bgg_id: g.bgg_id,
    yearpublished: g.yearpublished,
    players: g.players,
    time_min: g.time_min,
    publisher: g.publisher,
    tags: g.tags || [],
    weight: g.weight || "unknown",
    numplays: g.numplays_blake || 0,
    image: g.bgg_id ? images[String(g.bgg_id)] : undefined,
    owners: Array.isArray(g.owner) ? g.owner : g.owner ? [g.owner] : [],
    notes: g.notes || undefined,
    ratings: g.rating_by_person || {},
  }));
}
