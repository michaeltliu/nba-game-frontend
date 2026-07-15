import { useState } from "react";
import { headshotUrl, initials } from "../lib/format";

interface Props {
  pid: number;
  name: string;
  peak?: number;
  peakBadgeClassName?: string;
  className?: string;
}

export default function Headshot({
  pid,
  name,
  peak = 0,
  peakBadgeClassName = "",
  className = "",
}: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {failed ? (
        <div
          className="flex h-full w-full items-center justify-center rounded-[inherit] bg-gradient-to-br from-court-600 to-court-700 font-bold text-white/80"
        >
          <span>{initials(name)}</span>
        </div>
      ) : (
        <img
          src={headshotUrl(pid)}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full rounded-[inherit] object-cover object-top"
        />
      )}
      {peak > 0 && (
        <span
          className={`absolute bottom-1 right-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-black tracking-wide text-white backdrop-blur-sm ${peakBadgeClassName}`}
          title={`Peak season: ${peak}`}
          aria-label={`Peak season ${peak}`}
        >
          &apos;{String(peak).slice(-2).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}
