import type { Member } from "../types";
import { fmtScore, normalizeScore } from "../lib/format";
import Headshot from "./Headshot";

interface Props {
  members: Member[];
  myName: string;
}

const MEDALS = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

export default function StandingsBoard({ members, myName }: Props) {
  const ranked = [...members].sort((a, b) => b.score - a.score);
  const champion = ranked[0];

  return (
    <div className="space-y-5">
      {champion && (
        <div className="card animate-pop-in overflow-hidden border-flame-400/40 bg-gradient-to-b from-flame-500/20 to-court-800/60 p-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-flame-400">
            Champion
          </p>
          <h2 className="mt-1 text-3xl font-black">{champion.name}</h2>
          <p className="mt-1 text-white/60">
            Top roster with a score of{" "}
            <span className="font-bold text-white">
              {fmtScore(normalizeScore(champion.score, champion.nba_team.length))}
            </span>
          </p>
          <div className="mt-4 flex justify-center gap-2">
            {champion.nba_team.map((p) => (
              <Headshot
                key={p.pid}
                pid={p.pid}
                name={p.name}
                className="h-14 w-14 rounded-lg border border-white/10 bg-court-700"
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {ranked.map((m, idx) => {
          const isMe = m.name === myName;
          return (
            <div
              key={`${m.name}-${idx}`}
              className={`card flex items-center gap-4 p-4 ${
                isMe ? "ring-2 ring-flame-400/50" : ""
              }`}
            >
              <span className="w-8 text-center text-xl font-black text-white/70">
                {MEDALS[idx] ?? idx + 1}
              </span>
              <div className="flex-1">
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
          );
        })}
      </div>
    </div>
  );
}
