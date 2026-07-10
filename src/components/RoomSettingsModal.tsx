import { useEffect } from "react";
import { formatNbaEra } from "../lib/format";
import type { RoomSettings } from "../types";

interface Props {
  settings: RoomSettings;
  onClose: () => void;
}

const PENALTY_LABELS: Record<number, { label: string; detail: string }> = {
  0: {
    label: "None",
    detail: "No penalty for each missing ideal position.",
  },
  1: {
    label: "Default",
    detail: "Moderate penalty for each missing ideal position.",
  },
  2: {
    label: "Strict",
    detail: "Larger penalty for each missing ideal position.",
  },
};

export default function RoomSettingsModal({ settings, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const penalty = PENALTY_LABELS[settings.missing_position_penalty] ?? {
    label: `Level ${settings.missing_position_penalty}`,
    detail: "Custom missing-position penalty configured for this room.",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="room-settings-title"
    >
      <div
        className="card animate-pop-in flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-b-none sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-flame-400">
              Room setup
            </p>
            <h2 id="room-settings-title" className="text-lg font-black text-white">
              Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto px-5 py-5">
          <SettingItem
            label="NBA era"
            value={formatNbaEra(settings.nba_era)}
            detail="Player pool and stats are drawn from this era."
          />
          <SettingItem
            label="Bid timer"
            value={`${settings.bid_timer}s`}
            detail="Each auction round stays open for this long."
          />
          <SettingItem
            label="Missing-position penalty"
            value={penalty.label}
            detail={penalty.detail}
          />
          <SettingItem
            label="Extra queued players"
            value={`+${settings.additional_players_queued}`}
            detail="Additional players added to the auction queue per room member."
          />
        </div>
      </div>
    </div>
  );
}

function SettingItem({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-court-900/60 p-4">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="shrink-0 rounded-full border border-flame-400/30 bg-flame-500/10 px-3 py-1 text-sm font-bold text-flame-300">
          {value}
        </p>
      </div>
      <p className="text-xs leading-relaxed text-white/50">{detail}</p>
    </div>
  );
}
