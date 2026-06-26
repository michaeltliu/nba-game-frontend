import { useState } from "react";
import { headshotUrl, initials } from "../lib/format";

interface Props {
  pid: number;
  name: string;
  className?: string;
}

export default function Headshot({ pid, name, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-court-600 to-court-700 font-bold text-white/80 ${className}`}
      >
        <span>{initials(name)}</span>
      </div>
    );
  }

  return (
    <img
      src={headshotUrl(pid)}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover object-top ${className}`}
    />
  );
}
