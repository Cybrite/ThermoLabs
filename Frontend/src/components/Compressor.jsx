const buttonClass =
  "rounded-lg border px-3 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

const Compressor = ({ onCompress, onRelease, disabled }) => {
  return (
    <div className="lab-card">
      <h3 className="lab-card-title">Compressor</h3>

      <div className="group relative w-full overflow-hidden rounded-xl border border-cyan-300/40 bg-slate-900 px-3 py-4 text-left transition hover:border-cyan-200">
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
          <path
            d="M52 34 L66 26 L66 31 L96 31 L96 37 L66 37 L66 42 Z"
            className="fill-cyan-200/80"
          />
          <path
            d="M128 90 L114 98 L114 93 L84 93 L84 87 L114 87 L114 82 Z"
            className="fill-emerald-200/80"
          />
        </svg>

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <button
            onClick={onCompress}
            disabled={disabled}
            className={`${buttonClass} border-cyan-300/50 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20`}
          >
            Increase Pressure
          </button>
          <button
            onClick={onRelease}
            disabled={disabled}
            className={`${buttonClass} border-emerald-300/50 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20`}
          >
            Decrease Pressure
          </button>
        </div>
      </div>
    </div>
  );
};

export default Compressor;
