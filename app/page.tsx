import { loadGames } from "@/lib/games";
import { getTopTags, getOwners } from "@/lib/utils";
import { GameBrowser } from "@/components/GameBrowser";

export default function Home() {
  const games = loadGames();
  const topTags = getTopTags(games, 24);
  const owners = getOwners(games);
  return <GameBrowser games={games} topTags={topTags} owners={owners} />;
}
