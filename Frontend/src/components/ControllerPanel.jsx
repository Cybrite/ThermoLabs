import { formatUnit } from "../utils/formatters";

const rowClass =
  "flex items-center justify-between rounded-md bg-slate-900/70 px-3 py-2";

const ControllerPanel = ({ state, config, onIntensityChange }) => {
  const celsius = state.temperature;
  const fahrenheit = (celsius * 9) / 5 + 32;
  const kelvin = celsius + 273.15;
  const baseline = config.initialState.temperature;
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

      <div className="space-y-2 text-sm">
        <div className={rowClass}>
          <span>Temperature</span>
          <span className="font-mono text-rose-200">
            {formatUnit(state.temperature, "C", 1)}
          </span>
        </div>
        <div className={rowClass}>
          <span>Pressure</span>
          <span className="font-mono text-cyan-200">
            {formatUnit(state.pressure, "bar", 2)}
          </span>
        </div>
        <div className={rowClass}>
          <span>Volume</span>
          <span className="font-mono text-emerald-200">
            {formatUnit(state.volume, "L", 2)}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-slate-300">
          Action Intensity ({state.actionIntensity.toFixed(1)}x)
        </label>
        <input
          type="range"
          min={config.limits.actionIntensity.min}
          max={config.limits.actionIntensity.max}
          step="0.1"
          value={state.actionIntensity}
          onChange={(event) => onIntensityChange(Number(event.target.value))}
          className="lab-slider"
        />
      </div>

      <div className="mt-4 rounded-lg border border-slate-600/80 bg-slate-950/85 p-3">
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-slate-300">
          Temperature Data
        </p>
        <div className="space-y-1.5 text-xs">
          <div className={rowClass}>
            <span>Sensor °C</span>
            <span className="font-mono text-rose-200">
              {celsius.toFixed(2)} C
            </span>
          </div>
          <div className={rowClass}>
            <span>Sensor °F</span>
            <span className="font-mono text-rose-100">
              {fahrenheit.toFixed(2)} F
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
              {deltaFromStart.toFixed(2)} C
            </span>
          </div>
          <div className={rowClass}>
            <span>Operating Band</span>
            <span className="font-mono text-slate-200">
              {formatUnit(config.limits.temperature.min, "C", 0)} to{" "}
              {formatUnit(config.limits.temperature.max, "C", 0)}
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
