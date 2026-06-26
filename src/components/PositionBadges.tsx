import type { NBAPlayer } from "../types";

interface Props {
  player: Pick<NBAPlayer, "guard" | "forward" | "center">;
  className?: string;
}

const POSITIONS = [
  {
    key: "guard" as const,
    label: "G",
    className: "bg-sky-500/15 text-sky-300",
  },
  {
    key: "forward" as const,
    label: "F",
    className: "bg-emerald-500/15 text-emerald-300",
  },
  {
    key: "center" as const,
    label: "C",
    className: "bg-violet-500/15 text-violet-300",
  },
];

export default function PositionBadges({ player, className = "" }: Props) {
  const active = POSITIONS.filter((p) => player[p.key]);
  if (active.length === 0) return null;

  return (
    <span className={`flex flex-wrap gap-1 ${className}`}>
      {active.map((p) => (
        <span
          key={p.key}
          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${p.className}`}
        >
          {p.label}
        </span>
      ))}
    </span>
  );
}
