import { useState } from "react";
import Compressor from "./Compressor";
import PistonArrangement from "./PistonArrangement";
import PressureGauge from "./PressureGauge";
import Thermometer from "./Thermometer";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalize = (value, min, max) => {
  if (max <= min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
};

const buildParticleStyle = (index, side) => {
  const xSeed = side === "left" ? 31 : 53;
  const ySeed = side === "left" ? 17 : 23;
  const x = ((index * xSeed + 11) % 88) + 6;
  const y = ((index * ySeed + 5) % 78) + 10;
  const size = 3 + (index % 2);

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
  };
};

/* ── status badge ─────────────────────────────────────────── */
const StatusBadge = ({ connected, isRunning, isComplete }) => {
  let color, label;
  if (!connected) {
    color = "bg-red-500";
    label = "Disconnected";
  } else if (isRunning) {
    color = "bg-emerald-400 animate-pulse";
    label = "Simulating";
  } else if (isComplete) {
    color = "bg-amber-400";
    label = "Complete";
  } else {
    color = "bg-slate-400";
    label = "Idle";
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-400/50 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700 backdrop-blur-sm">
      <span className={`inline-block h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
};

/* ── format elapsed time as mm:ss ─────────────────────────── */
const fmtTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/* ── live value pill ──────────────────────────────────────── */
const LivePill = ({ label, value, unit, color = "text-slate-800" }) => (
  <div className="flex flex-col items-center rounded-lg border border-slate-300/80 bg-white px-3 py-1.5 shadow-sm">
    <span className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
      {label}
    </span>
    <span className={`font-mono text-sm font-semibold ${color}`}>
      {value}
      <span className="ml-0.5 text-[10px] font-normal text-slate-500">
        {unit}
      </span>
    </span>
  </div>
);

/* ── pressure input panel ─────────────────────────────────── */
const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30";

const PressureInputPanel = ({ currentP1, currentP2, onApply, connected }) => {
  const [p1Input, setP1Input] = useState(String(currentP1));
  const [p2Input, setP2Input] = useState(String(currentP2));
  const [validationError, setValidationError] = useState(null);

  const handleApply = () => {
    const p1 = parseFloat(p1Input);
    const p2 = parseFloat(p2Input);

    if (isNaN(p1) || isNaN(p2)) {
      setValidationError("Please enter valid numbers for both P1 and P2.");
      return;
    }
    if (p1 <= 0 || p2 <= 0) {
      setValidationError("Pressures must be positive values.");
      return;
    }
    if (p1 <= p2) {
      setValidationError("P1 (inlet) must be greater than P2 (outlet).");
      return;
    }
    setValidationError(null);
    onApply(p1, p2);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleApply();
  };

  return (
    <div className="mb-4 rounded-xl border border-slate-300/80 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">
        Set Pressures (Pa)
      </p>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div>
          <label
            htmlFor="p1-input"
            className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500"
          >
            P1 — Inlet (Pa)
          </label>
          <input
            id="p1-input"
            type="number"
            min="0"
            step="10000"
            value={p1Input}
            onChange={(e) => setP1Input(e.target.value)}
            onKeyDown={handleKeyDown}
            className={inputClass}
            placeholder="e.g. 500000"
          />
        </div>
        <div>
          <label
            htmlFor="p2-input"
            className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500"
          >
            P2 — Outlet (Pa)
          </label>
          <input
            id="p2-input"
            type="number"
            min="0"
            step="10000"
            value={p2Input}
            onChange={(e) => setP2Input(e.target.value)}
            onKeyDown={handleKeyDown}
            className={inputClass}
            placeholder="e.g. 100000"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleApply}
            disabled={!connected}
            className="w-full rounded-lg border border-cyan-500/50 bg-cyan-500/15 px-5 py-2 text-sm font-semibold text-cyan-800 shadow-sm transition hover:bg-cyan-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Apply
          </button>
        </div>
      </div>

      {validationError && (
        <p className="mt-2 rounded-md bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700">
          ⚠ {validationError}
        </p>
      )}

      <div className="mt-2.5 flex flex-wrap gap-3 text-[10px] text-slate-500">
        <span>
          Current P1:{" "}
          <span className="font-mono font-semibold text-cyan-700">
            {currentP1.toLocaleString()} Pa
          </span>
        </span>
        <span>
          Current P2:{" "}
          <span className="font-mono font-semibold text-emerald-700">
            {currentP2.toLocaleString()} Pa
          </span>
        </span>
        <span className="text-slate-400">
          Tip: Use inputs or the compressor buttons below (±50,000 Pa per click)
        </span>
      </div>
    </div>
  );
};

const ExperimentSetup = ({ state, derived, actions, config }) => {
  const p1Bar = state.p1;
  const p2Bar = state.p2;
  const p1Ratio = derived.p1Ratio;
  const p2Ratio = derived.p2Ratio;

  const leftTemp = state.leftTemp;
  const rightTemp = state.rightTemp;
  const leftRatio = derived.leftTempRatio;
  const rightRatio = derived.rightTempRatio;

  const leftParticles = Math.round(34 + p1Ratio * 62);
  const rightParticles = Math.round(14 + p2Ratio * 36);

  const pressureBias = clamp(
    (p1Bar - p2Bar) / Math.max(p1Bar + p2Bar, 0.01),
    -1,
    1,
  );
  const widthDelta = pressureBias * 18;
  const leftWidth = clamp(88 - widthDelta, 70, 96);
  const rightWidth = clamp(88 + widthDelta, 70, 96);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-300/70 bg-[#e9e9eb] p-4 text-slate-900 shadow-[0_22px_48px_rgba(15,23,42,0.25)] sm:p-6">
      {/* ── header row ────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold uppercase tracking-[0.16em] text-slate-900 sm:text-4xl">
            Joule-Thomson Effect
          </h2>
          <p className="pt-2 text-[11px] uppercase tracking-[0.18em] text-slate-600 sm:text-xs">
            Compartment Model — Live Simulation
          </p>
        </div>
        <StatusBadge
          connected={state.connected}
          isRunning={state.isRunning}
          isComplete={state.isComplete}
        />
      </div>

      {/* ── pressure input panel ──────────────────────── */}
      <PressureInputPanel
        currentP1={state.p1Pa}
        currentP2={state.p2Pa}
        onApply={actions.setPressures}
        connected={state.connected}
      />

      {/* ── live data ticker ──────────────────────────── */}
      {state.isRunning && (
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          <LivePill
            label="Sim Time"
            value={fmtTime(state.elapsedSimTime)}
            unit=""
            color="text-indigo-700"
          />
          <LivePill
            label="P1"
            value={(state.p1Pa / 1000).toFixed(1)}
            unit="kPa"
            color="text-cyan-700"
          />
          <LivePill
            label="P2"
            value={(state.p2Pa / 1000).toFixed(1)}
            unit="kPa"
            color="text-emerald-700"
          />
          <LivePill
            label="Temperature"
            value={state.liveTemperatureC.toFixed(2)}
            unit="°C"
            color="text-rose-700"
          />
          <LivePill
            label="Packet"
            value={`${state.packetNumber}/${state.totalPackets}`}
            unit=""
            color="text-slate-700"
          />
        </div>
      )}

      {/* ── throttle chamber ──────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-slate-300 bg-[#f5f5f5] p-4 sm:p-6">
        <div className="mb-5 grid grid-cols-3 items-start gap-2">
          <div className="flex justify-center">
            <Thermometer temperature={leftTemp} ratio={leftRatio} embedded />
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-700 sm:text-xs">
              Throttle Chamber
            </p>
            <p className="mt-2 text-base font-semibold text-slate-800 sm:text-2xl">
              T1 &gt; T2
            </p>
            <p className="text-base font-semibold text-slate-800 sm:text-2xl">
              P1 &gt; P2
            </p>
          </div>
          <div className="flex justify-center">
            <Thermometer temperature={rightTemp} ratio={rightRatio} embedded />
          </div>
        </div>

        <div className="h-4 rounded-sm bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500" />

        <div className="relative overflow-hidden rounded-md bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative h-36 flex-1">
              <div
                className="relative ml-auto h-36 rounded-md border border-slate-300 bg-[#fffdfa] transition-[width] duration-700"
                style={{ width: `${leftWidth}%` }}
              >
                <div className="absolute left-0 top-1/2 h-32 w-3 -translate-y-1/2 rounded-r-[2px] bg-slate-950" />
                <div className="absolute left-3 top-1/2 h-8 w-2 -translate-y-1/2 rounded-r-sm bg-slate-950" />
                {Array.from({ length: leftParticles }).map((_, index) => (
                  <span
                    key={`left-p-${index}`}
                    className="absolute rounded-full bg-amber-700/70"
                    style={buildParticleStyle(index, "left")}
                  />
                ))}
                <p className="absolute bottom-1 left-1/2 -translate-x-1/2 text-2xl font-medium text-slate-700 sm:text-3xl">
                  V1
                </p>
              </div>
            </div>

            <div className="relative h-28 w-[70px] sm:w-[84px]">
              <div className="absolute left-1/2 top-0 h-full w-6 -translate-x-1/2 rounded-md bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200" />
              <div className="absolute left-1/2 top-1/2 h-5 w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-md border border-slate-300 bg-white" />
            </div>

            <div className="relative h-36 flex-1">
              <div
                className="relative h-36 rounded-md border border-slate-300 bg-[#fffdfa] transition-[width] duration-700"
                style={{ width: `${rightWidth}%` }}
              >
                <div className="absolute right-0 top-1/2 h-32 w-3 -translate-y-1/2 rounded-l-[2px] bg-slate-950" />
                <div className="absolute right-3 top-1/2 h-8 w-2 -translate-y-1/2 rounded-l-sm bg-slate-950" />
                {Array.from({ length: rightParticles }).map((_, index) => (
                  <span
                    key={`right-p-${index}`}
                    className="absolute rounded-full bg-amber-700/70"
                    style={buildParticleStyle(index, "right")}
                  />
                ))}
                <p className="absolute bottom-1 left-1/2 -translate-x-1/2 text-2xl font-medium text-slate-700 sm:text-3xl">
                  V2
                </p>
              </div>
            </div>
          </div>
          <p className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 rounded-sm bg-white/90 px-1 text-xl font-semibold text-slate-800 sm:left-2 sm:text-2xl">
            P1
          </p>
          <p className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 rounded-sm bg-white/90 px-1 text-xl font-semibold text-slate-800 sm:right-2 sm:text-2xl">
            P2
          </p>
        </div>

        <div className="h-4 rounded-sm bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500" />

        <div className="mt-2 grid grid-cols-2 text-center text-sm font-medium text-slate-600 sm:text-[1.7rem]">
          <div>
            <p>Compartment 1</p>
            <p className="font-mono text-lg sm:text-2xl">
              {p1Bar.toFixed(2)} bar
            </p>
          </div>
          <div>
            <p>Compartment 2</p>
            <p className="font-mono text-lg sm:text-2xl">
              {p2Bar.toFixed(2)} bar
            </p>
          </div>
        </div>
      </div>

      {/* ── compressors & gauges ──────────────────────── */}
      <div className="mt-4 grid gap-3 lg:grid-cols-2 2xl:grid-cols-[minmax(0,1fr)_280px_280px_minmax(0,1fr)]">
        <div className="rounded-xl border border-slate-300 bg-white p-3">
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-600 sm:text-xs">
            Pressure Gauge P1
          </p>
          <PressureGauge
            pressure={p1Bar}
            ratio={p1Ratio}
            compact
            tone="light"
          />
        </div>

        <div className="rounded-xl border border-slate-300 bg-white p-3">
          <p className="mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-slate-600 sm:text-xs">
            Compressor — Left Side (P1)
          </p>
          <Compressor
            onCompress={actions.compressLeft}
            onRelease={actions.expandLeft}
            disabled={!state.connected}
            embedded
            tone="light"
            isRunning={state.isRunning}
          />
        </div>

        <div className="rounded-xl border border-slate-300 bg-white p-3">
          <p className="mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-slate-600 sm:text-xs">
            Compressor — Right Side (P2)
          </p>
          <Compressor
            onCompress={actions.compressRight}
            onRelease={actions.expandRight}
            disabled={!state.connected}
            embedded
            tone="light"
            isRunning={state.isRunning}
          />
        </div>

        <div className="rounded-xl border border-slate-300 bg-white p-3">
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-600 sm:text-xs">
            Pressure Gauge P2
          </p>
          <PressureGauge
            pressure={p2Bar}
            ratio={p2Ratio}
            compact
            tone="light"
          />
        </div>
      </div>
    </section>
  );
};

const LabScene = ({ state, derived, config, actions }) => {
  return (
    <section className="min-w-0 space-y-4">
      <ExperimentSetup
        state={state}
        derived={derived}
        actions={actions}
        config={config}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PistonArrangement
          volume={state.volume}
          ratio={derived.volumeRatio}
          min={config.limits.volume.min}
          max={config.limits.volume.max}
          onVolumeChange={actions.setVolume}
        />

        <div className="lab-card">
          <h3 className="lab-card-title">Compartment Relations</h3>
          <div className="space-y-2 text-sm text-slate-200">
            <div className="flex items-center justify-between rounded-md bg-slate-900/75 px-3 py-2">
              <span>Temperature Gradient</span>
              <span className="font-mono">
                {state.leftTemp.toFixed(1)} °C / {state.rightTemp.toFixed(1)} °C
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-slate-900/75 px-3 py-2">
              <span>Pressure Ratio</span>
              <span className="font-mono">
                {(state.p1 / Math.max(state.p2, 0.01)).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-slate-900/75 px-3 py-2">
              <span>P1 (Inlet)</span>
              <span className="font-mono text-cyan-200">
                {state.p1.toFixed(2)} bar ({(state.p1Pa / 1000).toFixed(1)} kPa)
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-slate-900/75 px-3 py-2">
              <span>P2 (Outlet)</span>
              <span className="font-mono text-emerald-200">
                {state.p2.toFixed(2)} bar ({(state.p2Pa / 1000).toFixed(1)} kPa)
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-slate-900/75 px-3 py-2">
              <span>Live Temperature</span>
              <span className="font-mono text-rose-200">
                {state.liveTemperatureK.toFixed(2)} K ({state.liveTemperatureC.toFixed(2)} °C)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LabScene;
