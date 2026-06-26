import type { Member } from "../types";
import { initials } from "../lib/format";

interface Props {
  roomCode: string;
  members: Member[];
  isOwner: boolean;
  starting: boolean;
  onStart: () => void;
}

export default function LobbyView({
  roomCode,
  members,
  isOwner,
  starting,
  onStart,
}: Props) {
  const canStart = members.length >= 2;

  return (
    <div className="mx-auto max-w-xl">
      <div className="card p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-flame-400">
          Waiting room
        </p>
        <h1 className="mt-1 text-2xl font-black">Share the code to invite</h1>
        <div className="my-5 inline-flex rounded-2xl border border-white/10 bg-court-900/70 px-8 py-4">
          <span className="text-4xl font-black tracking-[0.4em] text-flame-400">
            {roomCode}
          </span>
        </div>

        <div className="mt-2 space-y-2 text-left">
          <p className="text-sm font-medium text-white/50">
            Players ({members.length})
          </p>
          {members.map((m, i) => (
            <div
              key={`${m.name}-${i}`}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 animate-slide-down"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-court-600 text-xs font-bold text-white/80">
                {initials(m.name)}
              </span>
              <span className="font-semibold">{m.name}</span>
              {i === 0 && (
                <span className="ml-auto text-xs font-medium text-flame-400">
                  Host
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          {isOwner ? (
            <>
              <button
                className="btn-primary w-full"
                onClick={onStart}
                disabled={!canStart || starting}
              >
                {starting ? "Starting\u2026" : "Start Game"}
              </button>
              {!canStart && (
                <p className="mt-2 text-xs text-white/40">
                  Need at least 2 players to start.
                </p>
              )}
            </>
          ) : (
            <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
              Waiting for the host to start the game{"\u2026"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
