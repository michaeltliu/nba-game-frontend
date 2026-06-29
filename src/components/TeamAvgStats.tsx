import type { Member, TeamAvgStats as TeamAvgStatsType } from "../types";
import { fmtStat, rosterAverages } from "../lib/format";

const FIELDS: {
  key: keyof TeamAvgStatsType;
  label: string;
  isPct?: boolean;
}[] = [
  { key: "pts", label: "PTS" },
  { key: "reb", label: "REB" },
  { key: "ast", label: "AST" },
  { key: "blk", label: "BLK" },
  { key: "stl", label: "STL" },
  { key: "tov", label: "TOV" },
  { key: "ts", label: "TS%", isPct: true },
];

function fmtValue(value: number, isPct?: boolean): string {
  return isPct ? (value * 100).toFixed(1) : fmtStat(value);
}

export default function TeamAvgStats({ member }: { member: Member }) {
  const avg = rosterAverages(member);

  if (!avg) {
    return (
      <p className="mb-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-3 py-2.5 text-center text-[11px] text-white/25">
        Draft players to see team averages
      </p>
    );
  }

  return (
    <div className="mb-3 rounded-xl border border-white/10 bg-court-900/60 p-3">
      <p className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-white/40">
        <span>Team Averages</span>
        <span className="font-medium normal-case tracking-normal text-white/25">
          per player
        </span>
      </p>
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
        {FIELDS.map(({ key, label, isPct }) => (
          <div
            key={key}
            className="flex flex-col items-center rounded-lg bg-white/5 px-1 py-1.5"
          >
            <span className="text-sm font-bold tabular-nums text-white">
              {fmtValue(avg[key], isPct)}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-white/40">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
