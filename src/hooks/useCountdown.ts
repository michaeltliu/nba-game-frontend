import { useEffect, useState } from "react";

/**
 * Returns the whole seconds remaining until `endTs` (a Unix timestamp in
 * seconds), ticking every 250ms for a smooth display. Clamped at 0.
 */
export function useCountdown(endTs: number | null | undefined): number {
  const compute = () =>
    endTs ? Math.max(0, endTs - Date.now() / 1000) : 0;

  const [remaining, setRemaining] = useState<number>(compute);

  useEffect(() => {
    setRemaining(compute());
    if (!endTs) return;
    const id = window.setInterval(() => {
      setRemaining(Math.max(0, endTs - Date.now() / 1000));
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTs]);

  return remaining;
}
