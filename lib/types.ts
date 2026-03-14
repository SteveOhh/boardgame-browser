export interface Game {
  game_id: string;
  name: string;
  description?: string;
  bgg_id?: number;
  yearpublished?: number;
  players?: string;
  time_min?: number;
  publisher?: string;
  tags: string[];
  weight: "light" | "medium" | "heavy" | "unknown";
  numplays?: number;
  image?: string; // populated by fetch-images script
  owners: string[];
  notes?: string;
  ratings: Record<string, number>; // { "Blake": 10 }
}

export type WeightFilter = "all" | "light" | "medium" | "heavy";

export interface Filters {
  search: string;
  weight: WeightFilter;
  players: number | null;
  maxTime: number | null;
  tags: string[];
  playedOnly: boolean;
  owner: string | null;
}
