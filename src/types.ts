export interface NBAPlayer {
  name: string;
  pid: number;
  pts: number;
  ast: number;
  reb: number;
  blk: number;
  stl: number;
  tov: number;
  ts: number;
  skipped: boolean;
  guard: boolean;
  forward: boolean;
  center: boolean;
}

export type PositionKey = "guard" | "forward" | "center";

// Maps a position to the indices of the players in `nba_team` assigned there by
// the API's best-lineup solver. Empty ({}) before any lineup has been computed.
export type Lineup = Partial<Record<PositionKey, number[]>>;

export interface Member {
  name: string;
  nba_team: NBAPlayer[];
  lineup: Lineup;
  balance: number;
  score: number;
}

export interface PrevAuctionResult {
  winner: string;
  nba_player: NBAPlayer;
  price_paid: number;
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

export interface Session {
  roomCode: string;
  playerId: string;
  playerName: string;
  isOwner: boolean;
}
