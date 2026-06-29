import type { NBAPlayer, TeamAvgStats } from "../types";
import { fmtStat } from "../lib/format";
import Headshot from "./Headshot";
import PositionBadges from "./PositionBadges";

interface Props {
  player: NBAPlayer;
  // When provided, each stat bubble is colored relative to the team's current
  // per-player average so the user can see how this player compares.
  teamAvg?: TeamAvgStats | null;
}

function Stat({
  label,
  value,
  tone = "text-white",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-white/5 px-2 py-2.5">
      <span className={`text-lg font-bold tabular-nums ${tone}`}>{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
        {label}
      </span>
    </div>
  );
}

// Returns a tone class by comparing a player's stat to the team average.
// A 10% threshold avoids coloring noise on stats that are nearly equal.
function tone(
  value: number,
  avg: number | undefined,
  lowerIsBetter = false,
): string {
  if (avg === undefined || avg === 0) return "text-white";
  const diff = value - avg;
  if (Math.abs(diff) < avg * 0.1) return "text-white";
  const better = lowerIsBetter ? diff < 0 : diff > 0;
  return better ? "text-emerald-300" : "text-amber-300";
}

export default function PlayerCard({ player, teamAvg }: Props) {
  const tsTone = tone(player.ts, teamAvg?.ts);
  return (
    <div className="card animate-pop-in overflow-hidden">
      <div className="relative bg-gradient-to-b from-flame-500/20 to-transparent">
        {player.skipped > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500/20 px-2 py-1 text-xs font-semibold uppercase text-amber-300">
            No bids
          </span>
        )}
        <div className="flex items-end gap-4 px-5 pt-5">
          <Headshot
            pid={player.pid}
            name={player.name}
            className="h-24 w-24 shrink-0 rounded-2xl border border-white/10 bg-court-700 sm:h-28 sm:w-28"
          />
          <div className="min-w-0 pb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-flame-400">
              Now Auctioning
            </p>
            <h2 className="text-xl font-black leading-tight sm:text-2xl">{player.name}</h2>
            <PositionBadges player={player} className="mt-1.5" />
            <p className={`mt-2 text-sm font-bold ${tsTone === "text-white" ? "text-white/50" : tsTone}`}>
              TS%: {(player.ts * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-5 sm:grid-cols-6">
        <Stat label="PTS" value={fmtStat(player.pts)} tone={tone(player.pts, teamAvg?.pts)} />
        <Stat label="REB" value={fmtStat(player.reb)} tone={tone(player.reb, teamAvg?.reb)} />
        <Stat label="AST" value={fmtStat(player.ast)} tone={tone(player.ast, teamAvg?.ast)} />
        <Stat label="BLK" value={fmtStat(player.blk)} tone={tone(player.blk, teamAvg?.blk)} />
        <Stat label="STL" value={fmtStat(player.stl)} tone={tone(player.stl, teamAvg?.stl)} />
        <Stat label="TOV" value={fmtStat(player.tov)} tone={tone(player.tov, teamAvg?.tov, true)} />
      </div>
    </div>
  );
}
