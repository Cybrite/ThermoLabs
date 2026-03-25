const PistonArrangement = ({ volume, ratio, min, max, onVolumeChange }) => {
  const sliderValue = ((volume - min) / (max - min)) * 100;
  const pistonY = 40 + (1 - ratio) * 90;

  const handleSlider = (event) => {
    const percent = Number(event.target.value) / 100;
    const mappedVolume = min + percent * (max - min);
    onVolumeChange(mappedVolume);
  };

  return (
    <div className="lab-card">
      <h3 className="lab-card-title">Piston Arrangement</h3>
      <svg viewBox="0 0 220 170" className="h-48 w-full">
        <rect
          x="52"
          y="28"
          width="116"
          height="124"
          rx="10"
          className="fill-slate-900 stroke-slate-400"
          strokeWidth="2"
        />
        <rect
          x="58"
          y={pistonY}
          width="104"
          height="14"
          rx="4"
          className="fill-amber-300 transition-all duration-300"
        />
        <rect
          x="68"
          y={pistonY + 14}
          width="84"
          height={150 - (pistonY + 14)}
          className="fill-cyan-500/30 transition-all duration-300"
        />
        <line
          x1="110"
          y1="8"
          x2="110"
          y2={pistonY + 7}
          className="stroke-slate-300"
          strokeWidth="4"
        />
      </svg>

      <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-slate-300">
        Drag to change volume
      </label>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        onChange={handleSlider}
        className="lab-slider"
      />
      <p className="lab-value">{volume.toFixed(2)} L</p>
    </div>
  );
};

export default PistonArrangement;
