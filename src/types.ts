export interface NBAPlayer {
  name: string;
  pid: number;
  peak: number;
  pts: number;
  ast: number;
  reb: number;
  blk: number;
  stl: number;
  tov: number;
  ts: number;
  tsa: number;
  skipped: number;
  guard: boolean;
  forward: boolean;
  center: boolean;
}

export type PositionKey = "guard" | "forward" | "center";

// Maps a position to the indices of the players in `nba_team` assigned there by
// the API's best-lineup solver. Empty ({}) before any lineup has been computed.
export type Lineup = Partial<Record<PositionKey, number[]>>;

// Roster-wide averages computed by the API (each stat summed over the roster and
// divided by the roster size). Returned as {} until the member wins their first
// player, so consumers should treat it as partial.
export interface TeamAvgStats {
  pts: number;
  ast: number;
  reb: number;
  blk: number;
  stl: number;
  tov: number;
  ts: number;
}

export type BotDifficulty = "easy" | "medium" | "hard";

export type NbaEra =
  | "averages_1990_00"
  | "averages_2000_10"
  | "averages_2010_20"
  | "averages_2020_26"
  | "averages_2025_26"
  | "peaks_1990_00";

export interface Member {
  name: string;
  // null/undefined for human players; the bot skill level otherwise.
  bot_difficulty?: BotDifficulty | null;
  nba_team: NBAPlayer[];
  lineup: Lineup;
  avg_stats?: Partial<TeamAvgStats>;
  balance: number;
  score: number;
}

export interface PrevAuctionResult {
  winner: string;
  nba_player: NBAPlayer;
  price_paid: number;
}

export interface RoomSettings {
  missing_position_penalty: number;
  bid_timer: number;
  additional_players_queued: number;
  nba_era: NbaEra;
}

export interface RoomStatus {
  success: boolean;
  failure_msg?: string;
  members: Member[];
  player_queue: NBAPlayer[];
  round_num: number;
  round_ends_at: number;
  bids_received: number;
  prev_auction_result: PrevAuctionResult | null;
  prev_game_final: Member[];
  room_settings?: RoomSettings;
}

export interface CreateRoomResponse {
  success: boolean;
  failure_msg?: string;
  room_code?: string;
  player_id?: string;
}

export interface JoinRoomResponse {
  success: boolean;
  failure_msg?: string;
  player_id?: string;
}

export interface SimpleResponse {
  success: boolean;
  failure_msg?: string;
}

export interface AddedBot {
  bot_name: string;
  difficulty: BotDifficulty;
}

export interface AddBotResponse {
  success: boolean;
  failure_msg?: string;
  bots?: AddedBot[];
}

export interface Session {
  roomCode: string;
  playerId: string;
  playerName: string;
  isOwner: boolean;
  createdAt?: number;
}
