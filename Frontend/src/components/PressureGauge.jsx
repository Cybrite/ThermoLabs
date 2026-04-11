const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const PressureGauge = ({ pressure, ratio, compact = false, tone = "dark" }) => {
  const boundedRatio = clamp(ratio, 0, 1);
  const angle = -180 + boundedRatio * 180;
  const radians = (angle * Math.PI) / 180;
  const x = 70 + Math.cos(radians) * 50;
  const y = 90 + Math.sin(radians) * 50;
  const gaugeLength = 157;
  const isLight = tone === "light";

  if (compact) {
    return (
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 140 120" className="h-20 w-28">
          <path
            d="M20 90 A50 50 0 0 1 120 90"
            fill="none"
            className={isLight ? "stroke-slate-500" : "stroke-slate-300"}
            strokeWidth="8"
          />
          <path
            d="M20 90 A50 50 0 0 1 120 90"
            fill="none"
            className="stroke-cyan-400"
            strokeWidth="8"
            strokeDasharray={`${boundedRatio * gaugeLength} ${gaugeLength}`}
          />
          <line
            x1="70"
            y1="90"
            x2={x}
            y2={y}
            className="stroke-amber-300 transition-all duration-500"
            strokeWidth="3"
          />
          <circle cx="70" cy="90" r="5" className="fill-amber-200" />
        </svg>
        <p
          className={`rounded-md px-2 py-1 text-[11px] font-mono ${
            isLight
              ? "border border-slate-300 bg-white text-slate-800"
              : "border border-slate-500/70 bg-slate-900/75 text-slate-100"
          }`}
        >
          {pressure.toFixed(2)} bar
        </p>
      </div>
    );
  }

  return (
    <div className="lab-card">
      <h3 className="lab-card-title">Pressure Gauge</h3>
      <svg viewBox="0 0 140 120" className="h-52 w-full">
        <path
          d="M20 90 A50 50 0 0 1 120 90"
          fill="none"
          className="stroke-slate-300"
          strokeWidth="8"
        />
        <path
          d="M20 90 A50 50 0 0 1 120 90"
          fill="none"
          className="stroke-cyan-400"
          strokeWidth="8"
          strokeDasharray={`${boundedRatio * gaugeLength} ${gaugeLength}`}
        />

        <line
          x1="70"
          y1="90"
          x2={x}
          y2={y}
          className="stroke-amber-300 transition-all duration-500"
          strokeWidth="3"
        />
        <circle cx="70" cy="90" r="5" className="fill-amber-200" />
      </svg>
      <p className="lab-value">{pressure.toFixed(2)} bar</p>
    </div>
  );
};

export default PressureGauge;
