export function fmtStat(n: number, digits = 1): string {
  return n.toFixed(digits);
}

export function normalizeScore(score: number, rosterSize: number): number {
  if (rosterSize === 0 || score === 0) return 0;
  return Math.pow(score, 1 / rosterSize);
}

export function fmtScore(n: number): string {
  if (n === 0) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(2);
}

export function headshotUrl(pid: number): string {
  return `https://cdn.nba.com/headshots/nba/latest/1040x760/${pid}.png`;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const FAILURE_MESSAGES: Record<string, string> = {
  ROOM_CODE_NOT_FOUND: "That room code doesn't exist.",
  REQUIRES_OWNER: "Only the room owner can do that.",
  PLAYER_ID_NOT_FOUND: "You're not a member of this room.",
  EMPTY_PLAYER_NAME: "Please enter a name.",
  GAME_IN_PROGRESS: "This game has already started.",
  ALREADY_STARTED: "The game has already started.",
  BAD_ROUND_NUMBER: "This round just ended \u2014 hang tight.",
  INVALID_BID_AMOUNT: "That bid amount isn't valid.",
  ROSTER_FULL: "Your roster is already full.",
};

export function friendlyFailure(msg?: string): string {
  if (!msg) return "Something went wrong.";
  return FAILURE_MESSAGES[msg] ?? msg;
}
