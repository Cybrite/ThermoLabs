const actionButtonClass =
  "rounded-lg border px-3 py-2 text-sm font-semibold transition active:scale-[0.98]";

const SwitchPanel = ({
  onCompress,
  onExpand,
  onReset,
  onTogglePower,
  powerOn,
}) => {
  return (
    <section className="lab-card">
      <h3 className="lab-card-title">Switch Panel</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={onCompress}
          disabled={!powerOn}
          className={`${actionButtonClass} border-cyan-300/50 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20 disabled:opacity-50`}
        >
          Compress Gas
        </button>
        <button
          onClick={onExpand}
          disabled={!powerOn}
          className={`${actionButtonClass} border-emerald-300/50 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20 disabled:opacity-50`}
        >
          Expand Gas
        </button>
        <button
          onClick={onReset}
          className={`${actionButtonClass} border-rose-300/50 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20`}
        >
          Reset System
        </button>
        <button
          onClick={onTogglePower}
          className={`${actionButtonClass} ${
            powerOn
              ? "border-amber-300/60 bg-amber-400/15 text-amber-100 hover:bg-amber-300/20"
              : "border-slate-300/50 bg-slate-700/30 text-slate-100 hover:bg-slate-700/50"
          }`}
        >
          {powerOn ? "Power: ON" : "Power: OFF"}
        </button>
      </div>
    </section>
  );
};

export default SwitchPanel;
