import { useEffect, useState } from "react";

interface Props {
  balance: number;
  rosterFull: boolean;
  hasBidThisRound: boolean;
  totalPlayers: number;
  bidsReceived: number;
  disabled: boolean;
  onSubmit: (amount: number) => Promise<void>;
}

export default function BidPanel({
  balance,
  rosterFull,
  hasBidThisRound,
  totalPlayers,
  bidsReceived,
  disabled,
  onSubmit,
}: Props) {
  const [amount, setAmount] = useState(1);
  const [submitting, setSubmitting] = useState<null | "bid" | "skip">(null);

  useEffect(() => {
    setAmount((a) => Math.min(Math.max(a, 1), Math.max(balance, 1)));
  }, [balance]);

  const submit = async (value: number, kind: "bid" | "skip") => {
    setSubmitting(kind);
    try {
      await onSubmit(value);
    } finally {
      setSubmitting(null);
    }
  };

  const busy = submitting !== null;

  if (rosterFull) {
    return (
      <div className="card p-5 text-center text-white/60">
        Your roster is full. Sit back and watch the rest of the auction.
      </div>
    );
  }

  if (balance <= 0) {
    return (
      <div className="card p-5 text-center">
        <p className="text-base font-semibold text-white">Out of funds</p>
        <p className="mt-2 text-sm text-white/60">
          You{"\u2019"}ve spent your entire balance, so you can no longer bid.
          You{"\u2019"}ll auto-skip every remaining round.
        </p>
        <p className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[11px] leading-relaxed text-amber-200/80">
          Your roster will be completed automatically: with the leftover NBA
          players at the end of the auction, or a random pick whenever a player
          goes uncontested.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
            Your bid
          </p>
          <p className="text-3xl font-black tabular-nums text-flame-400">
            ${amount}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
            Balance
          </p>
          <p className="text-xl font-bold tabular-nums text-emerald-300">
            ${balance}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setAmount((a) => Math.max(1, a - 1))}
          disabled={disabled || busy || amount <= 1}
          aria-label="Decrease bid"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lg font-bold text-white/70 transition hover:bg-white/10 disabled:opacity-40"
        >
          {"\u2212"}
        </button>

        <input
          type="range"
          min={1}
          max={balance}
          step={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full"
          disabled={disabled || busy}
        />

        <button
          type="button"
          onClick={() => setAmount((a) => Math.min(balance, a + 1))}
          disabled={disabled || busy || amount >= balance}
          aria-label="Increase bid"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lg font-bold text-white/70 transition hover:bg-white/10 disabled:opacity-40"
        >
          +
        </button>
      </div>

      <button
        className="btn-primary mt-4 w-full"
        onClick={() => submit(amount, "bid")}
        disabled={disabled || busy}
      >
        {submitting === "bid"
          ? "Submitting\u2026"
          : hasBidThisRound
            ? `Update bid to $${amount}`
            : `Place bid: $${amount}`}
      </button>

      <button
        className="btn-ghost mt-2 w-full"
        onClick={() => submit(0, "skip")}
        disabled={disabled || busy}
      >
        {submitting === "skip" ? "Skipping\u2026" : "Skip player"}
      </button>

      <p className="mt-3 text-center text-xs text-white/40">
        {hasBidThisRound && (
          <span className="text-emerald-300">Bid locked in. </span>
        )}
        {bidsReceived}/{totalPlayers} players have bid {"\u00b7"} winner pays the
        second-highest bid
      </p>

      <p className="mt-2 text-center text-xs text-white/40">
        Skipping sends a $0 bid meaning an opponent could win this player
        for free.
      </p>
    </div>
  );
}
