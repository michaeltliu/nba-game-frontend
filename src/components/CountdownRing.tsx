interface Props {
  remaining: number;
  total: number;
  size?: number;
}

export default function CountdownRing({ remaining, total, size = 140 }: Props) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = total > 0 ? Math.min(1, Math.max(0, remaining / total)) : 0;
  const offset = circumference * (1 - pct);

  const seconds = Math.ceil(remaining);
  const urgent = remaining <= 5;
  const color = urgent ? "#ef4444" : remaining <= 10 ? "#ff8a3d" : "#ff6b00";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.25s linear, stroke 0.3s" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-4xl font-black tabular-nums ${
            urgent ? "animate-pulse text-red-400" : "text-white"
          }`}
        >
          {seconds}
        </span>
        <span className="text-xs font-medium uppercase tracking-wide text-white/40">
          seconds
        </span>
      </div>
    </div>
  );
}
