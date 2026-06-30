import type { Session } from "../types";

const SESSION_PREFIX = "hoops-auction:";
const EXPIRE_MS = 24 * 60 * 60 * 1000; // 24 hours

const keyFor = (roomCode: string) => `${SESSION_PREFIX}${roomCode.toUpperCase()}`;

export function saveSession(session: Session): void {
  try {
    const sessionWithTimestamp: Session = {
      ...session,
      roomCode: session.roomCode.toUpperCase(),
      createdAt: session.createdAt ?? Date.now(),
    };
    localStorage.setItem(
      keyFor(session.roomCode),
      JSON.stringify(sessionWithTimestamp),
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

export function cleanupExpiredSessions(): void {
  try {
    const now = Date.now();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(SESSION_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        try {
          const session = JSON.parse(raw) as Partial<Session>;
          if (!session.createdAt || now - session.createdAt > EXPIRE_MS) {
            keysToRemove.push(key);
          }
        } catch {
          // If the stored JSON is malformed, mark it for cleanup
          keysToRemove.push(key);
        }
      }
    }

    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  } catch {
    /* storage unavailable; ignore */
  }
}
