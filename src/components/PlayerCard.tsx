import type { NBAPlayer } from "../types";
import { fmtStat } from "../lib/format";
import Headshot from "./Headshot";
import PositionBadges from "./PositionBadges";

interface Props {
  player: NBAPlayer;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-white/5 px-2 py-2.5">
      <span className="text-lg font-bold tabular-nums text-white">{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
        {label}
      </span>
    </div>
  );
}

export default function PlayerCard({ player }: Props) {
  return (
    <div className="card animate-pop-in overflow-hidden">
      <div className="relative bg-gradient-to-b from-flame-500/20 to-transparent">
        {player.skipped > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase text-amber-300">
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
            <p className="mt-1 text-sm text-white/50">
              TS%: {(player.ts * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-5 sm:grid-cols-6">
        <Stat label="PTS" value={fmtStat(player.pts)} />
        <Stat label="REB" value={fmtStat(player.reb)} />
        <Stat label="AST" value={fmtStat(player.ast)} />
        <Stat label="BLK" value={fmtStat(player.blk)} />
        <Stat label="STL" value={fmtStat(player.stl)} />
        <Stat label="TOV" value={fmtStat(player.tov)} />
      </div>
    </div>
  );
}
