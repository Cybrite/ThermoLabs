const Thermometer = ({ temperature, ratio }) => {
  const fillHeight = 200 * ratio;

  return (
    <div className="lab-card">
      <h3 className="lab-card-title">Thermometer</h3>
      <svg viewBox="0 0 120 280" className="h-64 w-full">
        <defs>
          <linearGradient id="thermoLiquid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>

        <rect
          x="45"
          y="30"
          width="30"
          height="200"
          rx="15"
          className="fill-slate-900/80 stroke-slate-300"
          strokeWidth="2"
        />

        <rect
          x="52"
          y={230 - fillHeight}
          width="16"
          height={fillHeight}
          rx="8"
          fill="url(#thermoLiquid)"
          className="transition-all duration-500"
        />

        <circle
          cx="60"
          cy="242"
          r="26"
          fill="url(#thermoLiquid)"
          className="stroke-rose-200"
          strokeWidth="2"
        />

        {[0, 1, 2, 3, 4].map((tick) => (
          <line
            key={tick}
            x1="80"
            x2="94"
            y1={210 - tick * 40}
            y2={210 - tick * 40}
            className="stroke-slate-400"
            strokeWidth="2"
          />
        ))}
      </svg>

      <p className="lab-value">{temperature.toFixed(1)} C</p>
    </div>
  );
};

export default Thermometer;
