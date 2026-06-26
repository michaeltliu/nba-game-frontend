import type { PrevAuctionResult } from "../types";

interface Props {
  result: PrevAuctionResult;
}

export default function PrevResultBanner({ result }: Props) {
  const skipped = !result.winner;
  return (
    <div
      key={result.nba_player.pid + (result.winner ?? "skip")}
      className="animate-slide-down rounded-xl border border-white/10 bg-court-700/60 px-4 py-3 text-sm"
    >
      {skipped ? (
        <span className="text-white/70">
          <span className="font-semibold text-amber-300">
            {result.nba_player.name}
          </span>{" "}
          received no bids and was sent to the back of the queue.
        </span>
      ) : (
        <span className="text-white/70">
          <span className="font-semibold text-flame-400">{result.winner}</span>{" "}
          won{" "}
          <span className="font-semibold text-white">
            {result.nba_player.name}
          </span>{" "}
          for{" "}
          <span className="font-semibold text-emerald-300">
            ${result.price_paid}
          </span>
          .
        </span>
      )}
    </div>
  );
}
