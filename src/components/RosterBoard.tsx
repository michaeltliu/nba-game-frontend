import type { Member } from "../types";
import { fmtScore, normalizeScore, initials } from "../lib/format";
import PositionGroupedRoster from "./PositionGroupedRoster";

interface Props {
  members: Member[];
  myName: string;
}

export default function RosterBoard({ members, myName }: Props) {
  const sorted = [...members].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-3">
      {sorted.map((m, idx) => {
        const isMe = m.name === myName;
        return (
          <div
            key={`${m.name}-${idx}`}
            className={`card p-4 ${isMe ? "ring-2 ring-flame-400/50" : ""}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-court-600 text-xs font-bold text-white/70">
                  {initials(m.name)}
                </span>
                <span className="font-semibold">
                  {m.name}
                  {isMe && (
                    <span className="ml-1.5 text-xs font-medium text-flame-400">
                      (you)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 font-semibold text-emerald-300">
                  ${m.balance}
                </span>
                <span className="text-right">
                  <span className="block text-[10px] uppercase tracking-wider text-white/40">
                    Score
                  </span>
                  <span className="font-bold tabular-nums text-white">
                    {fmtScore(normalizeScore(m.score, m.nba_team.length))}
                  </span>
                </span>
              </div>
            </div>

            <PositionGroupedRoster member={m} />
          </div>
        );
      })}
    </div>
  );
}
