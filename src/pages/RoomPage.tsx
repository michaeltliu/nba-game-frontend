import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, ApiError } from "../api/client";
import { useRoomStatus } from "../hooks/useRoomStatus";
import { clearSession, loadSession, saveSession } from "../lib/session";
import { friendlyFailure } from "../lib/format";
import type { BotDifficulty, Session } from "../types";
import RoomHeader from "../components/RoomHeader";
import LobbyView from "../components/LobbyView";
import AuctionView from "../components/AuctionView";
import ResultsView from "../components/ResultsView";

export default function RoomPage() {
  const { code } = useParams<{ code: string }>();
  const roomCode = (code ?? "").toUpperCase();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(() =>
    loadSession(roomCode),
  );
  const { status, error, loading, refresh } = useRoomStatus(roomCode);

  const [toast, setToast] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  // Bots selected in the lobby but not yet sent to the backend. They are shown
  // in the member list optimistically and only created (via add-bot requests)
  // when the owner starts the game.
  const [pendingBots, setPendingBots] = useState<BotDifficulty[]>([]);
  const lastBidRoundKey = `hoops-last-bid-round:${roomCode}`;
  const [lastBidRound, setLastBidRound] = useState(() => {
    try {
      return Number(sessionStorage.getItem(lastBidRoundKey) ?? 0);
    } catch {
      return 0;
    }
  });

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 3000);
  };

  const me = useMemo(
    () => status?.members.find((m) => m.name === session?.playerName),
    [status, session],
  );

  const toggleBot = (difficulty: BotDifficulty) => {
    setPendingBots((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty],
    );
  };

  const handleStart = async () => {
    if (!session) return;
    setStarting(true);
    try {
      // Commit any locally-selected bots before starting the game, skipping any
      // difficulty that's already present on the server (e.g. added elsewhere).
      const existingBotDifficulties = new Set(
        status?.members.map((m) => m.bot_difficulty).filter(Boolean),
      );
      for (const difficulty of pendingBots) {
        if (existingBotDifficulties.has(difficulty)) continue;
        const res = await api.addBot(roomCode, session.playerId, difficulty);
        if (!res.success) {
          showToast(friendlyFailure(res.failure_msg));
          await refresh();
          return;
        }
      }
      const res = await api.startGame(roomCode, session.playerId);
      if (!res.success) {
        showToast(friendlyFailure(res.failure_msg));
        await refresh();
      } else {
        setPendingBots([]);
        await refresh();
      }
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Could not start game.");
    } finally {
      setStarting(false);
    }
  };

  const handleBid = async (amount: number) => {
    if (!session || !status) return;
    try {
      const res = await api.submitBid(
        roomCode,
        session.playerId,
        amount,
        status.round_num,
      );
      if (!res.success) {
        showToast(friendlyFailure(res.failure_msg));
      } else {
        setLastBidRound(status.round_num);
        try {
          sessionStorage.setItem(lastBidRoundKey, String(status.round_num));
        } catch {
          /* storage unavailable; ignore */
        }
        await refresh();
      }
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : "Could not submit bid.");
    }
  };

  if (!session) {
    return (
      <JoinGate
        roomCode={roomCode}
        onJoined={(s) => {
          saveSession(s);
          setSession(s);
        }}
        onBack={() => navigate("/")}
      />
    );
  }

  if (error) {
    return (
      <CenteredMessage
        title="Room unavailable"
        message={friendlyFailure(error)}
        onBack={() => {
          clearSession(roomCode);
          navigate("/");
        }}
      />
    );
  }

  if (loading || !status) {
    return <CenteredMessage title={"Loading room\u2026"} message="" onBack={null} />;
  }

  const inLobby = status.round_num === 0 && status.prev_game_final.length === 0;
  const inResults =
    status.round_num === 0 && status.prev_game_final.length > 0;
  const nbaPlayer = status.player_queue[0];

  const roundLabel =
    status.round_num > 0 ? `Round ${status.round_num}` : undefined;

  return (
    <div
      className={`mx-auto max-w-5xl px-4 py-6 ${
        inLobby ? "flex h-full min-h-0 flex-col overflow-hidden" : ""
      }`}
    >
      <RoomHeader
        roomCode={roomCode}
        playerName={session.playerName}
        roundLabel={roundLabel}
      />

      {inLobby && (
        <LobbyView
          roomCode={roomCode}
          members={status.members}
          isOwner={session.isOwner}
          starting={starting}
          pendingBots={pendingBots}
          onStart={handleStart}
          onToggleBot={toggleBot}
        />
      )}

      {inResults && (
        <ResultsView
          finalMembers={status.prev_game_final}
          myName={session.playerName}
          isOwner={session.isOwner}
          starting={starting}
          onPlayAgain={handleStart}
        />
      )}

      {status.round_num > 0 && nbaPlayer && (
        <AuctionView
          playerQueue={status.player_queue}
          roundNum={status.round_num}
          roundEndsAt={status.round_ends_at}
          bidsReceived={status.bids_received}
          members={status.members}
          me={me}
          myName={session.playerName}
          hasBidThisRound={lastBidRound === status.round_num}
          prevResult={status.prev_auction_result}
          onBid={handleBid}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-slide-down rounded-xl border border-red-500/30 bg-red-500/15 px-5 py-3 text-sm font-medium text-red-200 backdrop-blur">
          {toast}
        </div>
      )}
    </div>
  );
}

function JoinGate({
  roomCode,
  onJoined,
  onBack,
}: {
  roomCode: string;
  onJoined: (s: Session) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const join = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setErr("Please enter your name.");
    setBusy(true);
    setErr(null);
    try {
      const res = await api.joinRoom(roomCode, name.trim());
      if (!res.success || !res.player_id) {
        setErr(friendlyFailure(res.failure_msg));
        return;
      }
      onJoined({
        roomCode,
        playerId: res.player_id,
        playerName: name.trim(),
        isOwner: false,
      });
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not join room.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-12">
      <div className="card p-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-flame-400">
          Join room
        </p>
        <h1 className="mb-1 mt-1 text-2xl font-black tracking-[0.2em] text-white">
          {roomCode}
        </h1>
        <p className="mb-5 text-sm text-white/50">
          Enter your name to join this auction.
        </p>
        <form onSubmit={join}>
          <input
            className="input mb-4"
            placeholder="Your name"
            maxLength={24}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? "Joining\u2026" : "Join"}
          </button>
        </form>
        {err && (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {err}
          </p>
        )}
        <button
          onClick={onBack}
          className="mt-4 w-full text-sm text-white/40 hover:text-white/70"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}

function CenteredMessage({
  title,
  message,
  onBack,
}: {
  title: string;
  message: string;
  onBack: (() => void) | null;
}) {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="text-2xl font-black">{title}</h1>
      {message && <p className="mt-2 text-white/60">{message}</p>}
      {onBack && (
        <button onClick={onBack} className="btn-ghost mt-6">
          Back to home
        </button>
      )}
    </div>
  );
}
