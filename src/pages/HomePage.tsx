import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError } from "../api/client";
import { saveSession } from "../lib/session";
import { friendlyFailure, NBA_ERA_OPTIONS } from "../lib/format";
import type { NbaEra } from "../types";

type Tab = "create" | "join";

export default function HomePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("create");

  const [name, setName] = useState("");
  const [nbaEra, setNbaEra] = useState<NbaEra>("2025_26");
  const [bidTimer, setBidTimer] = useState(45);
  const [penalty, setPenalty] = useState(1);
  const [extraPlayers, setExtraPlayers] = useState(1);
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
        additionalPlayersQueued: extraPlayers,
        nbaEra,
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
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Hoops <span className="text-flame-500">Auction</span>
        </h1>
        <p className="mt-3 text-white/60">
          Play against your friends, bid on NBA
          stars, and build the best all-around roster.
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
              className="input !py-2.5"
              placeholder="LeBron James"
              maxLength={24}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {tab === "create" ? (
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="label" htmlFor="nba-era">
                  NBA era
                </label>
                <div className="relative">
                  <select
                    id="nba-era"
                    className="input appearance-none !py-2.5 !pr-11"
                    value={nbaEra}
                    onChange={(e) => setNbaEra(e.target.value as NbaEra)}
                  >
                    {NBA_ERA_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value} className="bg-court-900">
                        {label}
                      </option>
                    ))}
                  </select>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40"
                  >
                    <path
                      d="m5 7.5 5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <details className="group mb-5 overflow-hidden rounded-xl border border-white/10 bg-court-900/40">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-flame-400/70 [&::-webkit-details-marker]:hidden">
                  More settings
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    className="h-5 w-5 text-white/40 transition-transform duration-200 group-open:rotate-180"
                  >
                    <path
                      d="m5 7.5 5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </summary>

                <div className="border-t border-white/10 px-4 pb-4 pt-4">
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
                      {(
                        [
                          { value: 0, label: "None" },
                          { value: 1, label: "Default" },
                          { value: 2, label: "Strict" },
                        ] as const
                      ).map(({ value, label }) => (
                        <button
                          type="button"
                          key={value}
                          onClick={() => setPenalty(value)}
                          className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                            penalty === value
                              ? "border-flame-400 bg-flame-500/15 text-flame-400"
                              : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      Extra players queued per member:{" "}
                      <span className="font-bold text-flame-400">
                        +{extraPlayers}
                      </span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={3}
                      step={1}
                      value={extraPlayers}
                      onChange={(e) => setExtraPlayers(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="mt-1 flex justify-between text-xs text-white/40">
                      <span>0</span>
                      <span>3</span>
                    </div>
                  </div>
                </div>
              </details>

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
    </div>
  );
}
