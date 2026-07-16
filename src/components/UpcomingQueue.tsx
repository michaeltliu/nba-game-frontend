import type { NBAPlayer } from "../types";
import { fmtStat } from "../lib/format";
import Headshot from "./Headshot";
import PositionBadges from "./PositionBadges";

interface Props {
  upcoming: NBAPlayer[];
}

export default function UpcomingQueue({ upcoming }: Props) {
  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold uppercase tracking-wider text-white/40">
          Up Next
        </p>
        <span className="text-xs text-white/40">
          {upcoming.length} player{upcoming.length === 1 ? "" : "s"} remaining
        </span>
      </div>

      {upcoming.length === 0 ? (
        <p className="py-4 text-center text-sm text-white/40">
          This is the final player on the block.
        </p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {upcoming.map((p, i) => (
            <div
              key={`${p.pid}-${i}`}
              className="relative w-28 shrink-0 rounded-xl border border-white/10 bg-court-900/60 p-2"
              title={p.name}
            >
              <span className="absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-court-900/90 text-xs font-bold text-white/70">
                {i + 1}
              </span>
              {p.skipped > 0 && (
                <span className="absolute right-1.5 top-1.5 z-10 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-amber-300">
                  No bids
                </span>
              )}
              <Headshot
                pid={p.pid}
                brId={p.br_id}
                name={p.name}
                peak={p.peak}
                className="h-[5.75rem] w-full rounded-lg bg-court-700"
              />
              <p className="mt-1.5 truncate text-center text-xs font-medium text-white/80">
                {p.name}
              </p>
              <PositionBadges player={p} className="mt-1 justify-center" />
              <div className="mt-1 grid grid-cols-2 gap-x-1.0 gap-y-0.5 text-[9px] text-white/45">
                <span>{fmtStat(p.pts)} pts</span>
                <span>{fmtStat(p.stl + p.blk)} stk</span>
                <span>{fmtStat(p.reb)} reb</span>
                <span>{fmtStat(p.tov)} tov</span>
                <span>{fmtStat(p.ast)} ast</span>
                <span>{(p.ts * 100).toFixed(1)} TS%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
