import { Navigate, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from '@vercel/speed-insights/react';
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";

export default function App() {
  return (
    <div className="h-full">
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:code" element={<RoomPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <Analytics />
    <SpeedInsights />
    </div>
  );
}
