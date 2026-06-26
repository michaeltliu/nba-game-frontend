import type { Member } from "../types";
import { fmtScore, normalizeScore } from "../lib/format";
import PositionGroupedRoster from "./PositionGroupedRoster";

interface Props {
  members: Member[];
  myName: string;
}

const MEDALS = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

export default function StandingsBoard({ members, myName }: Props) {
  const ranked = [...members].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-2">
      {ranked.map((m, idx) => {
        const isMe = m.name === myName;
        const isChampion = idx === 0;
        return (
          <div
            key={`${m.name}-${idx}`}
            className={`card p-4 ${
              isChampion
                ? "animate-pop-in border-flame-400/40 bg-gradient-to-b from-flame-500/20 to-court-800/60"
                : ""
            } ${isMe ? "ring-2 ring-flame-400/50" : ""}`}
          >
            <div className="flex items-center gap-4">
              <span className="w-8 text-center text-xl font-black text-white/70">
                {MEDALS[idx] ?? idx + 1}
              </span>
              <div className="flex-1">
                {isChampion && (
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-flame-400">
                    Champion
                  </p>
                )}
                <p className="font-semibold">
                  {m.name}
                  {isMe && (
                    <span className="ml-1.5 text-xs font-medium text-flame-400">
                      (you)
                    </span>
                  )}
                </p>
                <p className="text-xs text-white/40">
                  {m.nba_team.length} players {"\u00b7"} ${m.balance} left
                </p>
              </div>
              <span className="text-right font-bold tabular-nums text-white">
                {fmtScore(normalizeScore(m.score, m.nba_team.length))}
              </span>
            </div>

            {m.nba_team.length > 0 && (
              <div className="mt-3">
                <PositionGroupedRoster member={m} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
