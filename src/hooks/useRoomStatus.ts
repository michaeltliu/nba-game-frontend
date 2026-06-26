import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "../api/client";
import type { RoomStatus } from "../types";

interface UseRoomStatusResult {
  status: RoomStatus | null;
  error: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

/**
 * Polls the room status endpoint. Polling is what actually advances the game,
 * since auctions resolve lazily on the server when status is fetched. We poll
 * a bit faster while a round is live so timer expiry is reflected promptly.
 */
export function useRoomStatus(
  roomCode: string | undefined,
  pollMs = 1000,
): UseRoomStatusResult {
  const [status, setStatus] = useState<RoomStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (!roomCode || inFlight.current) return;
    inFlight.current = true;
    try {
      const data = await api.roomStatus(roomCode);
      if (!data.success) {
        setError(data.failure_msg ?? "Room not found.");
        setStatus(null);
      } else {
        setStatus(data);
        setError(null);
      }
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Unexpected error fetching room.",
      );
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [roomCode]);

  useEffect(() => {
    if (!roomCode) return;
    let active = true;
    const tick = async () => {
      if (active) await refresh();
    };
    void tick();
    const id = window.setInterval(tick, pollMs);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [roomCode, pollMs, refresh]);

  return { status, error, loading, refresh };
}
