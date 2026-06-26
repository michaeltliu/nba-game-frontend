import { useEffect, useRef } from "react";
import type { Member, NBAPlayer, PrevAuctionResult } from "../types";
import { useCountdown } from "../hooks/useCountdown";
import CountdownRing from "./CountdownRing";
import PlayerCard from "./PlayerCard";
import BidPanel from "./BidPanel";
import RosterBoard from "./RosterBoard";
import PrevResultBanner from "./PrevResultBanner";
import UpcomingQueue from "./UpcomingQueue";

interface Props {
  playerQueue: NBAPlayer[];
  roundNum: number;
  roundEndsAt: number;
  bidsReceived: number;
  members: Member[];
  me: Member | undefined;
  myName: string;
  hasBidThisRound: boolean;
  prevResult: PrevAuctionResult | null;
  onBid: (amount: number) => Promise<void>;
}

export default function AuctionView({
  playerQueue,
  roundNum,
  roundEndsAt,
  bidsReceived,
  members,
  me,
  myName,
  hasBidThisRound,
  prevResult,
  onBid,
}: Props) {
  const nbaPlayer = playerQueue[0];
  const upcoming = playerQueue.slice(1);
  const remaining = useCountdown(roundEndsAt);

  // The API gives the round end timestamp but not the configured timer length,
  // so we capture the largest remaining time seen for this round as the total.
  const totalRef = useRef(0);
  useEffect(() => {
    totalRef.current = Math.max(1, Math.ceil(roundEndsAt - Date.now() / 1000));
  }, [roundEndsAt]);
  const ringTotal = Math.max(totalRef.current, Math.ceil(remaining), 1);

  const rosterFull = (me?.nba_team.length ?? 0) >= 5;
  const incompleteCount = members.filter((m) => m.nba_team.length < 5).length;
  const timeUp = remaining <= 0;

  return (
    <div className="grid gap-6 grid-cols-[1fr_380px]">
      <div className="min-w-0 space-y-5">
        {prevResult && <PrevResultBanner result={prevResult} />}

        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-stretch">
          <div className="card flex flex-col items-center justify-center gap-2 p-6 sm:w-52 sm:shrink-0">
            <CountdownRing remaining={remaining} total={ringTotal} />
            <p className="text-sm font-medium text-white/50">
              {timeUp ? "Resolving\u2026" : "Round closes in"}
            </p>
          </div>
          <div className="min-w-0 flex-1">
            <PlayerCard player={nbaPlayer} queuePosition={0} />
          </div>
        </div>

        <UpcomingQueue upcoming={upcoming} />

        {me ? (
          <BidPanel
            balance={me.balance}
            rosterFull={rosterFull}
            hasBidThisRound={hasBidThisRound}
            totalPlayers={incompleteCount}
            bidsReceived={bidsReceived}
            disabled={timeUp}
            onSubmit={onBid}
          />
        ) : (
          <div className="card p-5 text-center text-white/60">
            Spectating this room.
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/40">
          Rosters {"\u00b7"} Round {roundNum}
        </p>
        <RosterBoard members={members} myName={myName} />
      </div>
    </div>
  );
}
