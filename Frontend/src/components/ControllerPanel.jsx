import { formatUnit } from "../utils/formatters";

const rowClass =
  "flex items-center justify-between rounded-md bg-slate-900/70 px-3 py-2";

const ControllerPanel = ({ state, config, onIntensityChange }) => {
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
    </section>
  );
};

export default ControllerPanel;
