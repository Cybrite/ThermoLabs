const Thermometer = ({ temperature, ratio }) => {
  const fillHeight = 200 * ratio;

  return (
    <div className="lab-card">
      <h3 className="lab-card-title">Thermometer</h3>
      <svg viewBox="0 0 150 280" className="h-66 w-full">
        <defs>
          <linearGradient id="thermoLiquid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
        </defs>

        <rect
          x="20"
          y="18"
          width="100"
          height="242"
          rx="10"
          className="fill-slate-950/70 stroke-slate-500"
          strokeWidth="2"
        />

        <rect
          x="55"
          y="30"
          width="30"
          height="200"
          rx="15"
          className="fill-slate-900/80 stroke-slate-300"
          strokeWidth="2"
        />

        <rect
          x="62"
          y={230 - fillHeight}
          width="16"
          height={fillHeight}
          rx="8"
          fill="url(#thermoLiquid)"
          className="transition-all duration-500"
        />

        <circle
          cx="70"
          cy="238"
          r="20"
          fill="url(#thermoLiquid)"
          className="stroke-rose-200"
          strokeWidth="2"
        />

        {[0, 1, 2, 3, 4, 5].map((tick) => (
          <line
            key={tick}
            x1="92"
            x2="104"
            y1={230 - tick * 40}
            y2={230 - tick * 40}
            className="stroke-slate-400"
            strokeWidth="2"
          />
        ))}

        {[0, 1, 2, 3, 4, 5].map((tick) => (
          <text
            key={`label-${tick}`}
            x="105"
            y={234 - tick * 40}
            className="fill-slate-300 text-[8px]"
          >
            {tick * 40}
          </text>
        ))}
      </svg>

      <p className="lab-value">
        {temperature.toFixed(1)} C / {(temperature + 273.15).toFixed(1)} K
      </p>
    </div>
  );
};

export default Thermometer;
