import type { Member } from "../types";
import StandingsBoard from "./StandingsBoard";

interface Props {
  finalMembers: Member[];
  myName: string;
  isOwner: boolean;
  starting: boolean;
  onPlayAgain: () => void;
}

export default function ResultsView({
  finalMembers,
  myName,
  isOwner,
  starting,
  onPlayAgain,
}: Props) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-flame-400">
          Final Results
        </p>
        <h1 className="mt-1 text-3xl font-black">Game Over</h1>
      </div>

      <StandingsBoard members={finalMembers} myName={myName} />

      <div className="mt-6">
        {isOwner ? (
          <button
            className="btn-primary w-full"
            onClick={onPlayAgain}
            disabled={starting}
          >
            {starting ? "Starting\u2026" : "Play Again"}
          </button>
        ) : (
          <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white/60">
            Waiting for the host to start a new game{"\u2026"}
          </p>
        )}
      </div>
    </div>
  );
}
