/**
 * Pre-fetches BGG box art URLs for all games.
 * Run: npm run fetch-images
 * Output: data/images.json  { bgg_id: imageUrl }
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAMES_PATH = path.join(
  process.env.HOME,
  ".openclaw/apps/boardgame-picker/games.jsonl"
);
const OUT_PATH = path.join(__dirname, "../data/images.json");

const games = fs
  .readFileSync(GAMES_PATH, "utf-8")
  .split("\n")
  .filter(Boolean)
  .map((l) => JSON.parse(l))
  .filter((g) => g.bgg_id);

// Load existing to avoid re-fetching
let existing = {};
try {
  existing = JSON.parse(fs.readFileSync(OUT_PATH, "utf-8"));
} catch {}

const todo = games.filter((g) => !existing[String(g.bgg_id)]);
console.log(`Fetching images for ${todo.length} games (${games.length - todo.length} cached)…`);

const results = { ...existing };
let done = 0;

for (const game of todo) {
  try {
    const url = `https://api.geekdo.com/api/geekitems?objecttype=thing&objectid=${game.bgg_id}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "boardgame-browser/1.0" },
    });
    const data = await res.json();
    const img =
      data?.item?.images?.thumb ||
      data?.item?.images?.square ||
      data?.item?.images?.previewthumb ||
      null;
    if (img) results[String(game.bgg_id)] = img;
    done++;
    if (done % 20 === 0) {
      fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
      fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
      console.log(`  ${done}/${todo.length}`);
    }
    await new Promise((r) => setTimeout(r, 300));
  } catch (e) {
    console.warn(`  Failed ${game.name}: ${e.message}`);
  }
}

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
console.log(`Done. ${Object.keys(results).length} images saved.`);
