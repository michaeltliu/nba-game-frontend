import type { Member, NBAPlayer, PositionKey } from "../types";
import Headshot from "./Headshot";
import PositionBadges from "./PositionBadges";

const POSITION_GROUPS: { key: PositionKey; label: string; required: number }[] =
  [
    { key: "guard", label: "Guards", required: 2 },
    { key: "forward", label: "Forwards", required: 2 },
    { key: "center", label: "Centers", required: 1 },
  ];

function PlayerChip({ player }: { player: NBAPlayer }) {
  return (
    <div
      className="w-16 overflow-hidden rounded-lg border border-white/10 bg-court-900/60"
      title={player.name}
    >
      <Headshot
        pid={player.pid}
        name={player.name}
        className="aspect-square w-full"
      />
      <p className="truncate px-1 pt-1 text-center text-[10px] text-white/60">
        {player.name.split(" ").slice(1).join(" ") || player.name}
      </p>
      <PositionBadges player={player} className="justify-center px-1 pb-1" />
    </div>
  );
}

export default function PositionGroupedRoster({ member }: { member: Member }) {
  const hasLineup = Object.keys(member.lineup ?? {}).length > 0;

  // Fallback when the API hasn't computed a lineup yet (empty dict): show every
  // player in a single row instead of grouping by position.
  if (!hasLineup) {
    if (member.nba_team.length === 0) {
      return (
        <p className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-3 py-3 text-center text-[11px] text-white/25">
          No players yet
        </p>
      );
    }
    return (
      <div className="flex flex-wrap gap-2">
        {member.nba_team.map((p, i) => (
          <PlayerChip key={i} player={p} />
        ))}
      </div>
    );
  }

  // Track placed players so any leftovers (e.g. an unsolvable lineup) still get
  // shown rather than silently dropped.
  const assigned = new Set<number>();

  return (
    <div className="space-y-3">
      {POSITION_GROUPS.map((group) => {
        const indices = member.lineup[group.key] ?? [];
        const players = indices
          .map((i) => {
            assigned.add(i);
            return member.nba_team[i];
          })
          .filter(Boolean);
        const filled = players.length >= group.required;

        return (
          <div key={group.key}>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                {group.label}
              </span>
              <span
                className={`text-[10px] font-semibold tabular-nums ${
                  filled ? "text-emerald-400/70" : "text-amber-400/80"
                }`}
                title={
                  filled
                    ? "Position requirement met"
                    : "Unfilled \u2014 incurs scoring penalty"
                }
              >
                {players.length}/{group.required}
              </span>
            </div>
            {players.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {players.map((p, i) => (
                  <PlayerChip key={i} player={p} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-3 py-2 text-[11px] text-white/25">
                None assigned
              </div>
            )}
          </div>
        );
      })}

      {(() => {
        const leftovers = member.nba_team.filter((_, i) => !assigned.has(i));
        if (leftovers.length === 0) return null;
        return (
          <div>
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Bench
            </span>
            <div className="flex flex-wrap gap-2">
              {leftovers.map((p, i) => (
                <PlayerChip key={i} player={p} />
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
