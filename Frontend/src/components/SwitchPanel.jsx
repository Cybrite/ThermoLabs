const actionButtonClass =
  "rounded-lg border px-3 py-2 text-sm font-semibold transition active:scale-[0.98]";

const SwitchPanel = ({
  onStartSimulation,
  onStopSimulation,
  onReset,
  connected,
  isRunning,
  P1,
  P2,
}) => {
  return (
    <section className="lab-card">
      <h3 className="lab-card-title">Switch Panel</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => onStartSimulation(P1, P2)}
          disabled={!connected || isRunning}
          className={`${actionButtonClass} border-cyan-300/50 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/20 disabled:opacity-50`}
        >
          {isRunning ? "Simulation Running…" : "Start Simulation"}
        </button>
        <button
          onClick={onStopSimulation}
          disabled={!connected || !isRunning}
          className={`${actionButtonClass} border-rose-300/50 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20 disabled:opacity-50`}
        >
          Stop Simulation
        </button>
        <button
          onClick={onReset}
          className={`${actionButtonClass} border-rose-300/50 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20`}
        >
          Reset System
        </button>
        <div
          className={`${actionButtonClass} flex items-center justify-center gap-2 ${
            connected
              ? "border-amber-300/60 bg-amber-400/15 text-amber-100"
              : "border-slate-300/50 bg-slate-700/30 text-slate-100"
          }`}
        >
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              connected ? "bg-emerald-400 animate-pulse" : "bg-red-500"
            }`}
          />
          {connected ? "Socket: Connected" : "Socket: Disconnected"}
        </div>
      </div>
    </section>
  );
};

export default SwitchPanel;
