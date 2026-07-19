import type { BotDifficulty, Member } from "../types";
import { initials } from "../lib/format";

interface Props {
  roomCode: string;
  members: Member[];
  isOwner: boolean;
  starting: boolean;
  pendingBots: BotDifficulty[];
  onStart: () => void;
  onToggleBot: (difficulty: BotDifficulty) => void;
}

const BOT_LEVELS: { value: BotDifficulty; label: string; blurb: string }[] = [
  { value: "easy", label: "Easy", blurb: "Understands player value" },
  { value: "medium", label: "Medium", blurb: "Bids aggressively" },
  { value: "hard", label: "Hard", blurb: "No weaknesses" },
];

const botDisplayName = (difficulty: BotDifficulty) =>
  `${difficulty.charAt(0).toUpperCase()}${difficulty.slice(1)} Bot`;

export default function LobbyView({
  roomCode,
  members,
  isOwner,
  starting,
  pendingBots,
  onStart,
  onToggleBot,
}: Props) {
  // Bots already committed on the server (e.g. carried over from a prior game).
  const committedDifficulties = new Set(
    members
      .map((m) => m.bot_difficulty)
      .filter((d): d is BotDifficulty => d != null),
  );
  // Only show a pending bot if the server doesn't already have that difficulty.
  const visiblePending = pendingBots.filter(
    (d) => !committedDifficulties.has(d),
  );
  const takenDifficulties = new Set<BotDifficulty>([
    ...committedDifficulties,
    ...visiblePending,
  ]);

  const totalPlayers = members.length + visiblePending.length;
  const canStart = totalPlayers >= 2;
  const lockedStartMessage = "Need at least 2 players to start.";

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col">
      <div className="card flex min-h-0 flex-1 flex-col overflow-hidden p-4 text-center sm:p-6">
        <div className="shrink-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-flame-400 sm:text-sm">
            Waiting room
          </p>
          <h1 className="mt-1 text-xl font-black sm:text-2xl">
            Share the code to invite
          </h1>
          <div className="my-3 inline-flex rounded-2xl border border-white/10 bg-court-900/70 px-6 py-3 sm:my-5 sm:px-8 sm:py-4">
            <span className="text-3xl font-black tracking-[0.35em] text-flame-400 sm:text-4xl sm:tracking-[0.4em]">
              {roomCode}
            </span>
          </div>
        </div>

        <div className="mt-1 flex min-h-0 flex-1 flex-col text-left sm:mt-2">
          <p className="shrink-0 text-sm font-medium text-white/50">
            Players ({totalPlayers})
          </p>

          <div className="mt-1 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1 sm:space-y-2">
            {members.map((m, i) => {
              const isBot = m.bot_difficulty != null;
              return (
                <div
                  key={`${m.name}-${i}`}
                  className="flex animate-slide-down items-center gap-2.5 rounded-xl border border-white/5 bg-white/5 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold sm:h-8 sm:w-8 ${
                      isBot
                        ? "bg-flame-500/20 text-flame-300"
                        : "bg-court-600 text-white/80"
                    }`}
                  >
                    {isBot ? "\u{1F916}" : initials(m.name)}
                  </span>
                  <span className="font-semibold">{m.name}</span>
                  {isBot ? (
                    <span className="ml-auto rounded-full border border-flame-400/30 bg-flame-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-flame-300">
                      {m.bot_difficulty} bot
                    </span>
                  ) : (
                    i === 0 && (
                      <span className="ml-auto text-xs font-medium text-flame-400">
                        Host
                      </span>
                    )
                  )}
                </div>
              );
            })}

            {visiblePending.map((difficulty) => (
              <div
                key={`pending-${difficulty}`}
                className="flex animate-slide-down items-center gap-2.5 rounded-xl border border-flame-400/20 bg-flame-500/[0.06] px-3 py-2 sm:gap-3 sm:px-4 sm:py-3"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-flame-500/20 text-xs font-bold text-flame-300 sm:h-8 sm:w-8">
                  {"\u{1F916}"}
                </span>
                <span className="font-semibold">
                  {botDisplayName(difficulty)}
                </span>
                {isOwner ? (
                  <button
                    type="button"
                    onClick={() => onToggleBot(difficulty)}
                    aria-label={`Remove ${botDisplayName(difficulty)}`}
                    disabled={starting}
                    className="ml-auto flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition-colors hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {"\u00D7"}
                  </button>
                ) : (
                  <span className="ml-auto rounded-full border border-flame-400/30 bg-flame-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-flame-300">
                    {difficulty} bot
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0">
          {isOwner && (
            <div className="mt-3 rounded-xl border border-white/10 bg-court-900/40 p-3 text-left sm:mt-5 sm:p-4">
              <p className="text-sm font-semibold text-white/70">Add a bot</p>
              <p className="mt-0.5 text-xs text-white/40">
                Bots fill the room and bid automatically each round. Tap to add or remove.
              </p>
              <div className="mt-2.5 grid grid-cols-3 gap-2 sm:mt-3">
                {BOT_LEVELS.map(({ value, label, blurb }) => {
                  const committed = committedDifficulties.has(value);
                  const selected = takenDifficulties.has(value);
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => onToggleBot(value)}
                      disabled={committed || starting}
                      className={`flex flex-col items-center rounded-xl border px-2 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed sm:px-3 sm:py-2.5 ${
                        selected
                          ? "border-flame-400 bg-flame-500/15 text-flame-400"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10 active:scale-[0.98] disabled:opacity-50"
                      }`}
                    >
                      <span>{label}</span>
                      <span className="mt-0.5 hidden text-[10px] font-medium leading-tight text-white/40 sm:block">
                        {committed
                          ? "Added"
                          : selected
                            ? "Tap to remove"
                            : blurb}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-6">
            {isOwner ? (
              <div
                className="group relative"
                tabIndex={!canStart ? 0 : undefined}
                aria-describedby={!canStart ? "start-game-lock-reason" : undefined}
              >
                <button
                  className="btn-primary w-full"
                  onClick={onStart}
                  disabled={!canStart || starting}
                >
                  {starting ? "Starting\u2026" : "Start Game"}
                </button>
                {!canStart && (
                  <div
                    id="start-game-lock-reason"
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-[calc(100vw-3rem)] -translate-x-1/2 rounded-lg border border-white/10 bg-court-900 px-3 py-2 text-xs font-medium text-white/70 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100"
                  >
                    {lockedStartMessage}
                  </div>
                )}
              </div>
            ) : (
              <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                Waiting for the host to start the game{"\u2026"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
