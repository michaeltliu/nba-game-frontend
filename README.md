# Hoops Auction — Frontend

The frontend client for the `nba-game` app. Friends join a room and competitively
bid on a queue of NBA players in a timed, second-price (Vickrey) auction. Winners
add players to their roster, and once everyone's roster is full the game ranks
players by their combined statistical score.

Built with **React + Vite + TypeScript + Tailwind CSS**.

## Live site

https://hoopsauction.app/

## Features

- Create or join a room with a 5-letter code (shareable link supported)
- Live per-round countdown ring (the auction timer)
- Bid panel with quick-bid buttons, balance cap, and a "winner pays second price" hint
- Real NBA player headshots (with graceful initials fallback)
- Live rosters, balances, and running scores for every player
- Final standings screen with the champion highlighted, plus "Play Again"

## How it works

The backend has no WebSockets — the client polls `GET /rooms/{code}/status`
roughly once per second. The server resolves each auction lazily on those polls
(when the timer expires or all expected bids are in), so polling is what advances
the game. Player identity is the `X-Player-Id` header returned by create/join,
persisted in `localStorage` so refreshes keep your seat.

## Prerequisites

- Node.js 18+ and npm
- The `nba-game` API running (defaults to `http://localhost:8000`) with Redis available

## Setup

```bash
npm install
```

Configure the API URL (optional — defaults to `http://localhost:8000`):

```bash
cp .env.example .env
# edit VITE_API_BASE_URL if your API is elsewhere
```

## Run (development)

Start the backend first (from the `nba-game` directory):

```bash
uvicorn main:app --reload --port 8000
```

Then start the frontend:

```bash
npm run dev
```

Open http://localhost:5173.

> CORS: the backend allows `http://localhost:5173` by default. In production set
> the `FRONTEND_ORIGINS` env var on the API (comma-separated origins).

## Build

```bash
npm run build      # type-check + production bundle into dist/
npm run preview    # preview the production build
```

## Project structure

```
src/
  api/client.ts        Typed fetch wrapper (injects X-Player-Id, base URL from env)
  hooks/
    useRoomStatus.ts   Polling loop that drives the game
    useCountdown.ts    Smooth per-round countdown
  lib/
    session.ts         localStorage identity persistence
    format.ts          Stat/score formatting, headshot URLs, error messages
  components/          PlayerCard, BidPanel, CountdownRing, RosterBoard, etc.
  pages/
    HomePage.tsx       Create / join
    RoomPage.tsx       Orchestrates Lobby / Auction / Results views
  types.ts             API response types
```
