const PressureGauge = ({ pressure, ratio }) => {
  const angle = -120 + ratio * 240;
  const radians = (angle * Math.PI) / 180;
  const x = 70 + Math.cos(radians) * 44;
  const y = 70 + Math.sin(radians) * 44;

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
          strokeDasharray={`${ratio * 157} 157`}
        />

        <line
          x1="70"
          y1="70"
          x2={x}
          y2={y}
          className="stroke-amber-300 transition-all duration-500"
          strokeWidth="3"
        />
        <circle cx="70" cy="70" r="5" className="fill-amber-200" />
      </svg>
      <p className="lab-value">{pressure.toFixed(2)} bar</p>
    </div>
  );
};

export default PressureGauge;
