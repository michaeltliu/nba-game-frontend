import type {
  CreateRoomResponse,
  JoinRoomResponse,
  RoomStatus,
  SimpleResponse,
} from "../types";

const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

class ApiError extends Error {}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; playerId?: string } = {},
): Promise<T> {
  const { method = "GET", body, playerId } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (playerId) headers["X-Player-Id"] = playerId;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Could not reach the game server. Is the API running and CORS enabled?",
    );
  }

  if (!res.ok) {
    throw new ApiError(`Server error (${res.status}). Please try again.`);
  }
  return (await res.json()) as T;
}

export interface CreateRoomParams {
  playerName: string;
  bidSubmissionTimer: number;
  missingPositionPenalty: number;
}

export const api = {
  createRoom(params: CreateRoomParams): Promise<CreateRoomResponse> {
    return request<CreateRoomResponse>("/create-room", {
      method: "POST",
      body: {
        player_name: params.playerName,
        bid_submission_timer: params.bidSubmissionTimer,
        missing_position_penalty: params.missingPositionPenalty,
      },
    });
  },

  joinRoom(roomCode: string, playerName: string): Promise<JoinRoomResponse> {
    return request<JoinRoomResponse>(
      `/join-room/${encodeURIComponent(roomCode)}`,
      { method: "POST", body: { player_name: playerName } },
    );
  },

  roomStatus(roomCode: string): Promise<RoomStatus> {
    return request<RoomStatus>(
      `/rooms/${encodeURIComponent(roomCode)}/status`,
    );
  },

  startGame(roomCode: string, playerId: string): Promise<SimpleResponse> {
    return request<SimpleResponse>(
      `/rooms/${encodeURIComponent(roomCode)}/start-game`,
      { method: "POST", playerId },
    );
  },

  submitBid(
    roomCode: string,
    playerId: string,
    bidAmount: number,
    roundNum: number,
  ): Promise<SimpleResponse> {
    return request<SimpleResponse>(
      `/rooms/${encodeURIComponent(roomCode)}/bid`,
      {
        method: "POST",
        playerId,
        body: { bid_amount: bidAmount, round_num: roundNum },
      },
    );
  },
};

export { ApiError };
