import { useEffect, useState } from "react";
import type { Member } from "../types";
import { fmtScore, normalizeScore, initials } from "../lib/format";
import PositionGroupedRoster from "./PositionGroupedRoster";
import TeamAvgStats from "./TeamAvgStats";

interface Props {
  members: Member[];
  myName: string;
}

function RosterCard({ member, isMe }: { member: Member; isMe: boolean }) {
  return (
    <div className={`card p-4 ${isMe ? "ring-2 ring-flame-400/50" : ""}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-court-600 text-xs font-bold text-white/70">
            {initials(member.name)}
          </span>
          <span className="font-semibold">
            {member.name}
            {isMe && (
              <span className="ml-1.5 text-xs font-medium text-flame-400">
                (you)
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="rounded-lg bg-emerald-500/15 px-2.5 py-1 font-semibold text-emerald-300">
            ${member.balance}
          </span>
          <span className="text-right">
            <span className="block text-[10px] uppercase tracking-wider text-white/40">
              Score
            </span>
            <span className="font-bold tabular-nums text-white">
              {fmtScore(normalizeScore(member.score, member.nba_team.length))}
            </span>
          </span>
        </div>
      </div>

      <TeamAvgStats member={member} />

      <PositionGroupedRoster member={member} />
    </div>
  );
}

export default function RosterBoard({ members, myName }: Props) {
  const me = members.find((m) => m.name === myName);
  const others = members
    .filter((m) => m.name !== myName)
    .sort((a, b) => b.score - a.score);

  const [selectedName, setSelectedName] = useState<string>(
    () => others[0]?.name ?? "",
  );

  // Keep the selection valid as members come and go (e.g. someone leaves).
  useEffect(() => {
    if (others.length === 0) {
      if (selectedName !== "") setSelectedName("");
    } else if (!others.some((m) => m.name === selectedName)) {
      setSelectedName(others[0].name);
    }
  }, [others, selectedName]);

  const selected = others.find((m) => m.name === selectedName);

  // Spectators (no own roster) fall through to `others`, which already
  // includes every member, so they can browse all rosters via the dropdown.
  return (
    <div className="space-y-3">
      {me && <RosterCard member={me} isMe />}

      {others.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="roster-select"
              className="text-[11px] font-semibold uppercase tracking-wider text-white/40"
            >
              View player
            </label>
            <select
              id="roster-select"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-court-900/60 px-3 py-1.5 text-sm font-medium text-white outline-none focus:border-flame-400/50"
            >
              {others.map((m) => (
                <option key={m.name} value={m.name} className="bg-court-900">
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {selected && <RosterCard member={selected} isMe={false} />}
        </div>
      )}
    </div>
  );
}
