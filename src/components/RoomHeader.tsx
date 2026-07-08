import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RoomSettings } from "../types";
import RulesModal from "./RulesModal";
import RoomSettingsModal from "./RoomSettingsModal";

interface Props {
  roomCode: string;
  playerName: string;
  roundLabel?: string;
  roomSettings?: RoomSettings;
}

export default function RoomHeader({
  roomCode,
  playerName,
  roundLabel,
  roomSettings,
}: Props) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
        {roomSettings && (
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
            title="Room settings"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
              <path d="M8 4v4" />
              <path d="M16 10v4" />
              <path d="M11 16v4" />
            </svg>
            <span className="hidden sm:inline">Settings</span>
          </button>
        )}
        <button
          onClick={() => setShowRules(true)}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
          title="Instructions"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7" />
            <path d="M12 17h.01" />
          </svg>
          <span className="hidden sm:inline">Instructions</span>
        </button>
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

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {showSettings && roomSettings && (
        <RoomSettingsModal
          settings={roomSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </header>
  );
}
