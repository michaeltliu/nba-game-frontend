import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError } from "../api/client";
import { saveSession } from "../lib/session";
import { friendlyFailure } from "../lib/format";

type Tab = "create" | "join";

export default function HomePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("create");

  const [name, setName] = useState("");
  const [bidTimer, setBidTimer] = useState(30);
  const [penalty, setPenalty] = useState(1);
  const [joinCode, setJoinCode] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter your name.");
    setBusy(true);
    setError(null);
    try {
      const res = await api.createRoom({
        playerName: name.trim(),
        bidSubmissionTimer: bidTimer,
        missingPositionPenalty: penalty,
      });
      if (!res.success || !res.room_code || !res.player_id) {
        setError(friendlyFailure(res.failure_msg));
        return;
      }
      saveSession({
        roomCode: res.room_code,
        playerId: res.player_id,
        playerName: name.trim(),
        isOwner: true,
      });
      navigate(`/room/${res.room_code}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create room.");
    } finally {
      setBusy(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (!name.trim()) return setError("Please enter your name.");
    if (!code) return setError("Please enter a room code.");
    setBusy(true);
    setError(null);
    try {
      const res = await api.joinRoom(code, name.trim());
      if (!res.success || !res.player_id) {
        setError(friendlyFailure(res.failure_msg));
        return;
      }
      saveSession({
        roomCode: code,
        playerId: res.player_id,
        playerName: name.trim(),
        isOwner: false,
      });
      navigate(`/room/${code}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not join room.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-flame-400/30 bg-flame-500/10 px-4 py-1.5 text-sm font-medium text-flame-400">
          Live Player Auction
        </div>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Hoops <span className="text-flame-500">Auction</span>
        </h1>
        <p className="mt-3 text-white/60">
          Gather your friends, bid on NBA stars, and build the best statistical
          roster.
        </p>
      </div>

      <div className="card w-full p-2">
        <div className="mb-2 grid grid-cols-2 gap-1 rounded-xl bg-court-900/60 p-1">
          {(["create", "join"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setError(null);
              }}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                tab === t
                  ? "bg-gradient-to-b from-flame-400 to-flame-600 text-court-900"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {t === "create" ? "Create Room" : "Join Room"}
            </button>
          ))}
        </div>

        <div className="p-4">
          <div className="mb-4">
            <label className="label" htmlFor="name">
              Your name
            </label>
            <input
              id="name"
              className="input"
              placeholder="e.g. Mike"
              maxLength={24}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {tab === "create" ? (
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="label">
                  Bid timer per round:{" "}
                  <span className="font-bold text-flame-400">
                    {bidTimer}s
                  </span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={120}
                  step={5}
                  value={bidTimer}
                  onChange={(e) => setBidTimer(Number(e.target.value))}
                  className="w-full"
                />
                <div className="mt-1 flex justify-between text-xs text-white/40">
                  <span>10s</span>
                  <span>120s</span>
                </div>
              </div>

              <div className="mb-5">
                <label className="label">Missing-position penalty</label>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPenalty(p)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                        penalty === p
                          ? "border-flame-400 bg-flame-500/15 text-flame-400"
                          : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn-primary w-full" disabled={busy}>
                {busy ? "Creating\u2026" : "Create Room"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoin}>
              <div className="mb-5">
                <label className="label" htmlFor="code">
                  Room code
                </label>
                <input
                  id="code"
                  className="input text-center text-2xl font-bold uppercase tracking-[0.3em]"
                  placeholder="ABCDE"
                  maxLength={5}
                  value={joinCode}
                  onChange={(e) =>
                    setJoinCode(e.target.value.toUpperCase().slice(0, 5))
                  }
                />
              </div>
              <button className="btn-primary w-full" disabled={busy}>
                {busy ? "Joining\u2026" : "Join Room"}
              </button>
            </form>
          )}

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-white/30">
        Highest bid wins each auction and pays the second-highest price.
      </p>
    </div>
  );
}
