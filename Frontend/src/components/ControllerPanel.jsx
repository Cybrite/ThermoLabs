import { formatUnit } from "../utils/formatters";

const rowClass =
  "flex items-center justify-between rounded-md bg-slate-900/70 px-3 py-2";

const fmtTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const ControllerPanel = ({ state, config, onIntensityChange }) => {
  const celsius = state.liveTemperatureC;
  const fahrenheit = (celsius * 9) / 5 + 32;
  const kelvin = state.liveTemperatureK;
  const baseline = 26.85; // ~300K default
  const deltaFromStart = celsius - baseline;

  const operatingStatus =
    celsius < 5 ? "Sub-cooled" : celsius > 85 ? "Overheated" : "Stable";

  const statusClass =
    operatingStatus === "Stable"
      ? "text-emerald-200"
      : operatingStatus === "Sub-cooled"
        ? "text-cyan-200"
        : "text-amber-200";

  return (
    <section className="lab-card">
      <h3 className="lab-card-title">Controller Panel</h3>

      {/* ── simulation status ─────────────────────────── */}
      <div className="mb-4 rounded-lg border border-slate-600/80 bg-slate-950/85 p-3">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-300">
          Simulation Status
        </p>
        <div className="space-y-1.5 text-sm">
          <div className={rowClass}>
            <span>Connection</span>
            <span className="flex items-center gap-1.5 font-semibold">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  state.connected
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-red-500"
                }`}
              />
              <span
                className={
                  state.connected ? "text-emerald-200" : "text-red-300"
                }
              >
                {state.connected ? "Connected" : "Disconnected"}
              </span>
            </span>
          </div>
          <div className={rowClass}>
            <span>Simulation</span>
            <span
              className={`font-semibold ${
                state.isRunning
                  ? "text-emerald-200"
                  : state.isComplete
                    ? "text-amber-200"
                    : "text-slate-400"
              }`}
            >
              {state.isRunning
                ? "Running"
                : state.isComplete
                  ? "Complete"
                  : "Idle"}
            </span>
          </div>
          <div className={rowClass}>
            <span>Elapsed Time</span>
            <span className="font-mono text-indigo-200">
              {fmtTime(state.elapsedSimTime)}
            </span>
          </div>
          <div className={rowClass}>
            <span>Data Packets</span>
            <span className="font-mono text-slate-200">
              {state.packetNumber} / {state.totalPackets}
            </span>
          </div>
          {state.error && (
            <div className="rounded-md bg-red-950/60 px-3 py-2 text-red-300">
              ⚠ {state.error}
            </div>
          )}
        </div>
      </div>

      {/* ── live readings ─────────────────────────────── */}
      <div className="space-y-2 text-base">
        <div className={rowClass}>
          <span>P1 (Inlet)</span>
          <span className="font-mono text-cyan-200">
            {state.p1.toFixed(2)} bar
          </span>
        </div>
        <div className={rowClass}>
          <span>P2 (Outlet)</span>
          <span className="font-mono text-emerald-200">
            {state.p2.toFixed(2)} bar
          </span>
        </div>
        <div className={rowClass}>
          <span>Temperature</span>
          <span className="font-mono text-rose-200">
            {formatUnit(celsius, "°C", 2)}
          </span>
        </div>
      </div>

      {/* ── temperature data ──────────────────────────── */}
      <div className="mt-4 rounded-lg border border-slate-600/80 bg-slate-950/85 p-3">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-300">
          Temperature Data
        </p>
        <div className="space-y-1.5 text-sm">
          <div className={rowClass}>
            <span>Sensor °C</span>
            <span className="font-mono text-rose-200">
              {celsius.toFixed(2)} °C
            </span>
          </div>
          <div className={rowClass}>
            <span>Sensor °F</span>
            <span className="font-mono text-rose-100">
              {fahrenheit.toFixed(2)} °F
            </span>
          </div>
          <div className={rowClass}>
            <span>Sensor K</span>
            <span className="font-mono text-rose-100">
              {kelvin.toFixed(2)} K
            </span>
          </div>
          <div className={rowClass}>
            <span>Delta From Start</span>
            <span className="font-mono text-amber-100">
              {deltaFromStart >= 0 ? "+" : ""}
              {deltaFromStart.toFixed(2)} °C
            </span>
          </div>
          <div className={rowClass}>
            <span>System Status</span>
            <span className={`font-semibold ${statusClass}`}>
              {operatingStatus}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ControllerPanel;
