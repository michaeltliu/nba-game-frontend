import { useEffect } from "react";

interface Props {
  onClose: () => void;
}

export default function RulesModal({ onClose }: Props) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-title"
    >
      <div
        className="card animate-pop-in flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-b-none sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-flame-400">
              Good to know
            </p>
            <h2 id="rules-title" className="text-lg font-black text-white">
              Instructions
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

        <div className="space-y-6 overflow-y-auto px-5 py-5">
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
              Scoring
            </h3>
            <div className="rounded-xl border border-white/10 bg-court-900/60 p-4">
              <p className="mb-3 text-sm text-white/70">
                Your raw score is calculated from your roster{"\u2019"}s combined stats
                as follows:
              </p>
              <div className="rounded-lg bg-black/30 px-3 py-3 text-center text-sm font-semibold tabular-nums text-white">
                <span className="text-flame-300">
                  PTS<sup className="text-[0.75em]">1.2</sup>
                </span>
                {" \u00d7 "}
                <span className="text-flame-300">REB</span>
                {" \u00d7 "}
                <span className="text-flame-300">AST</span>
                {" \u00d7 "}
                <span className="text-flame-300">
                  BLK<sup className="text-[0.75em]">0.2</sup>
                </span>
                {" \u00d7 "}
                <span className="text-flame-300">
                  STL<sup className="text-[0.75em]">0.2</sup>
                </span>
                {" \u00d7 "}
                <span className="text-flame-300">
                  STK<sup className="text-[0.75em]">0.4</sup>
                </span>
                {" \u00d7 "}
                <span className="text-flame-300">
                  TS%<sup className="text-[0.75em]">1.5</sup>
                </span>
                <div className="my-1.5 flex items-center justify-center gap-2 text-white/40">
                  <span className="h-px w-10 bg-white/20" />
                  <span className="text-xs">divided by</span>
                  <span className="h-px w-10 bg-white/20" />
                </div>
                <span className="text-flame-300">TOV<sup className="text-[0.75em]">0.5</sup></span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/40">
                Each stat category is totaled across all five players on your roster. TS% is weighted by each player's true shooting attempts.
                The scoring formula rewards teams for being strong in all stat categories.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-white/40">
                Raw scores are normalized based on current roster size for display purposes.
              </p>
            </div>
          </section>

          <section>
            <div className="rounded-xl border border-white/10 bg-court-900/60 p-4">
              <p className="mb-3 text-sm text-white/70">
                The ideal roster has 2 guards, 2 forwards, and 1 center. Your{" "}
                <span className="font-mono font-semibold text-white">shortfall</span> is the total number of missing players vs. the ideal. Any shortfall from that target is penalized.
              </p>
              <p className="mb-3 text-sm leading-relaxed text-white/60">
                Your final score is multiplied by{" "}
                <span className="font-mono font-semibold text-white">penalty<sup className="text-[0.75em]">shortfall</sup></span>,
                where <span className="font-mono font-semibold text-white">penalty</span> is set by the room:
              </p>
              <div className="mb-3 divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10">
                <div className="flex items-center justify-between bg-white/[0.03] px-3 py-2 text-sm">
                  <span className="text-white/60">No penalty</span>
                  <span className="font-mono font-semibold text-white">&thinsp;1</span>
                </div>
                <div className="flex items-center justify-between bg-white/[0.03] px-3 py-2 text-sm">
                  <span className="text-white/60">Default</span>
                  <span className="font-mono font-semibold text-flame-300">&thinsp;(1&thinsp;/&thinsp;2)<sup>0.25</sup></span>
                </div>
                <div className="flex items-center justify-between bg-white/[0.03] px-3 py-2 text-sm">
                  <span className="text-white/60">Strict</span>
                  <span className="font-mono font-semibold text-flame-300">&thinsp;(1&thinsp;/&thinsp;2)<sup>0.5</sup></span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-white/40">
                The score shown in-game already has this penalty applied.
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
              Auction edge cases
            </h3>
            <ul className="space-y-3">
              <RuleItem title="Nobody bids on a player">
                If everyone skips a player, he{"\u2019"}s sent to the back of the
                queue. If he gets skipped enough times, he{"\u2019"}s automatically
                handed to a random team for free.
              </RuleItem>
              <RuleItem title="Two bids tie">
                When the top bid is a tie, the player who submitted it first wins.
              </RuleItem>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function RuleItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-1 text-sm font-semibold text-white">{title}</p>
      <p className="text-sm leading-relaxed text-white/60">{children}</p>
    </li>
  );
}
