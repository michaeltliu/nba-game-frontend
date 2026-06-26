import type { Session } from "../types";

const keyFor = (roomCode: string) => `hoops-auction:${roomCode.toUpperCase()}`;

export function saveSession(session: Session): void {
  try {
    localStorage.setItem(
      keyFor(session.roomCode),
      JSON.stringify({ ...session, roomCode: session.roomCode.toUpperCase() }),
    );
  } catch {
    /* storage unavailable; ignore */
  }
}

export function loadSession(roomCode: string): Session | null {
  try {
    const raw = localStorage.getItem(keyFor(roomCode));
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function clearSession(roomCode: string): void {
  try {
    localStorage.removeItem(keyFor(roomCode));
  } catch {
    /* ignore */
  }
}
