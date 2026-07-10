import type { Member, NbaEra, TeamAvgStats } from "../types";

export const NBA_ERA_OPTIONS: { value: NbaEra; label: string }[] = [
  { value: "2025_26", label: "2025–26 season" },
  { value: "2020_26", label: "2020–26 era" },
  { value: "2010_20", label: "2010–20 era" },
];

export function formatNbaEra(era: NbaEra | string): string {
  return NBA_ERA_OPTIONS.find((o) => o.value === era)?.label ?? era;
}

export function fmtStat(n: number, digits = 1): string {
  return n.toFixed(digits);
}

const AVG_KEYS: (keyof TeamAvgStats)[] = [
  "pts",
  "ast",
  "reb",
  "blk",
  "stl",
  "tov",
  "ts",
];

// Returns a member's per-player averages. Prefers the API-computed `avg_stats`,
// falling back to computing from the current roster (covers the brief window
// before the server recomputes, or stale/empty `avg_stats`).
export function rosterAverages(member: Member): TeamAvgStats | null {
  const roster = member.nba_team;
  if (!roster || roster.length === 0) return null;

  const provided = member.avg_stats;
  if (provided && AVG_KEYS.every((k) => typeof provided[k] === "number")) {
    return provided as TeamAvgStats;
  }

  const sums: TeamAvgStats = {
    pts: 0,
    ast: 0,
    reb: 0,
    blk: 0,
    stl: 0,
    tov: 0,
    ts: 0,
  };
  for (const p of roster) {
    for (const k of AVG_KEYS) sums[k] += p[k];
  }
  const c = roster.length;
  return {
    pts: sums.pts / c,
    ast: sums.ast / c,
    reb: sums.reb / c,
    blk: sums.blk / c,
    stl: sums.stl / c,
    tov: sums.tov / c,
    ts: sums.ts / c,
  };
}


export function normalizeScore(score: number, rosterSize: number): number {
  if (rosterSize === 0 || score === 0) return 0;
  return score / Math.pow(rosterSize, 3.5); // 1.2 + 1 + 1 + 0.2 + 0.2 + 0.4 - 0.5
}

export function fmtScore(n: number): string {
  if (n === 0) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
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
  INVALID_DIFFICULTY: "That bot difficulty isn't valid.",
  DIFFICULTY_ALREADY_ADDED: "A bot of that difficulty is already in the room.",
  NAME_TAKEN: "Couldn't name the bot \u2014 try again.",
};

export function friendlyFailure(msg?: string): string {
  if (!msg) return "Something went wrong.";
  return FAILURE_MESSAGES[msg] ?? msg;
}
