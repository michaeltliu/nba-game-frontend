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
  const [amount, setAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setAmount((a) => Math.min(a, balance));
  }, [balance]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(amount);
    } finally {
      setSubmitting(false);
    }
  };

  if (rosterFull) {
    return (
      <div className="card p-5 text-center text-white/60">
        Your roster is full. Sit back and watch the rest of the auction.
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

      <input
        type="range"
        min={0}
        max={balance}
        step={1}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full"
        disabled={disabled || submitting}
      />

      <div className="mt-3 flex gap-2">
        {[0.25, 0.5, 0.75, 1].map((frac) => (
          <button
            key={frac}
            type="button"
            onClick={() => setAmount(Math.floor(balance * frac))}
            disabled={disabled || submitting}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-xs font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-40"
          >
            {frac === 1 ? "Max" : `${frac * 100}%`}
          </button>
        ))}
      </div>

      <button
        className="btn-primary mt-4 w-full"
        onClick={handleSubmit}
        disabled={disabled || submitting}
      >
        {submitting
          ? "Submitting\u2026"
          : hasBidThisRound
            ? `Update bid to $${amount}`
            : `Place bid: $${amount}`}
      </button>

      <p className="mt-3 text-center text-xs text-white/40">
        {hasBidThisRound && (
          <span className="text-emerald-300">Bid locked in. </span>
        )}
        {bidsReceived}/{totalPlayers} players have bid {"\u00b7"} winner pays the
        second-highest bid
      </p>
    </div>
  );
}
