import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  roomCode: string;
  playerName: string;
  roundLabel?: string;
}

export default function RoomHeader({
  roomCode,
  playerName,
  roundLabel,
}: Props) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <button
        onClick={() => navigate("/")}
        className="text-lg font-black tracking-tight"
      >
        Hoops <span className="text-flame-500">Auction</span>
      </button>

      <div className="flex items-center gap-3">
        {roundLabel && (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/70">
            {roundLabel}
          </span>
        )}
        <button
          onClick={copy}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm transition hover:bg-white/10"
          title="Copy room code"
        >
          <span className="text-white/40">Room</span>
          <span className="font-bold tracking-[0.2em] text-flame-400">
            {roomCode}
          </span>
          <span className="text-xs text-white/40">
            {copied ? "Copied!" : "Copy"}
          </span>
        </button>
        <span className="hidden rounded-full bg-court-700 px-3 py-1.5 text-sm font-medium text-white/70 sm:inline">
          {playerName}
        </span>
      </div>
    </header>
  );
}
