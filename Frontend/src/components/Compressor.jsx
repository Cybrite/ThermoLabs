const Compressor = ({ onCompress, disabled }) => {
  return (
    <div className="lab-card">
      <h3 className="lab-card-title">Compressor</h3>
      <button
        onClick={onCompress}
        disabled={disabled}
        className="group relative w-full overflow-hidden rounded-xl border border-cyan-300/40 bg-slate-900 px-3 py-4 text-left transition hover:border-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg viewBox="0 0 220 120" className="h-28 w-full">
          <rect
            x="20"
            y="40"
            width="120"
            height="48"
            rx="10"
            className="fill-slate-700"
          />
          <rect
            x="138"
            y="48"
            width="22"
            height="32"
            rx="5"
            className="fill-cyan-300"
          />
          <circle cx="184" cy="64" r="20" className="fill-slate-600" />
          <circle
            cx="184"
            cy="64"
            r="8"
            className="fill-cyan-200 transition-transform duration-300 group-hover:scale-125"
          />
        </svg>
        <span className="mt-2 block text-sm text-cyan-100">
          Tap to increase pressure
        </span>
      </button>
    </div>
  );
};

export default Compressor;
