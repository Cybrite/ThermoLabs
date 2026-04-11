import Compressor from "./Compressor";
import PistonArrangement from "./PistonArrangement";
import PressureGauge from "./PressureGauge";
import Thermometer from "./Thermometer";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalize = (value, min, max) => {
  if (max <= min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
};

const getCoupledPressures = (pressure, limits, baselinePressure) => {
  const p1 = clamp(pressure, limits.min, limits.max);
  const p2 = clamp(
    (baselinePressure * baselinePressure) / Math.max(p1, 0.05),
    limits.min,
    limits.max,
  );

  return { p1, p2 };
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

const ExperimentSetup = ({ state, derived, actions, config }) => {
  const { p1: p1Pressure, p2: p2Pressure } = getCoupledPressures(
    state.pressure,
    config.limits.pressure,
    config.initialState.pressure,
  );

  const pressureSpan = config.limits.pressure.max - config.limits.pressure.min;
  const p1Ratio = normalize(
    p1Pressure,
    config.limits.pressure.min,
    config.limits.pressure.max,
  );
  const p2Ratio = normalize(
    p2Pressure,
    config.limits.pressure.min,
    config.limits.pressure.max,
  );

  const pressureBias = clamp((p1Pressure - p2Pressure) / pressureSpan, -1, 1);
  const thermalShift = pressureBias * 22;
  const leftTemp = clamp(
    state.temperature + thermalShift,
    config.limits.temperature.min,
    config.limits.temperature.max,
  );
  const rightTemp = clamp(
    state.temperature - thermalShift,
    config.limits.temperature.min,
    config.limits.temperature.max,
  );
  const leftRatio = normalize(
    leftTemp,
    config.limits.temperature.min,
    config.limits.temperature.max,
  );
  const rightRatio = normalize(
    rightTemp,
    config.limits.temperature.min,
    config.limits.temperature.max,
  );

  const leftParticles = Math.round(34 + p1Ratio * 62);
  const rightParticles = Math.round(14 + p2Ratio * 36);

  // In-place compression/expansion: chambers stay fixed in position,
  // only their internal widths change based on pressure difference.
  const widthDelta = pressureBias * 18;
  const leftWidth = clamp(88 - widthDelta, 70, 96);
  const rightWidth = clamp(88 + widthDelta, 70, 96);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-300/70 bg-[#e9e9eb] p-4 text-slate-900 shadow-[0_22px_48px_rgba(15,23,42,0.25)] sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-2xl font-semibold uppercase tracking-[0.16em] text-slate-900 sm:text-4xl">
          Joule-Thomson Effect
        </h2>
        <p className="pt-2 text-[11px] uppercase tracking-[0.18em] text-slate-600 sm:text-xs">
          Compartment Model
        </p>
      </div>

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
                className="relative ml-auto h-36 rounded-md border border-slate-300 bg-[#fffdfa] transition-[width] duration-300"
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
                className="relative h-36 rounded-md border border-slate-300 bg-[#fffdfa] transition-[width] duration-300"
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
            <p className="font-mono text-lg sm:text-2xl">P1 V1</p>
          </div>
          <div>
            <p>Compartment 2</p>
            <p className="font-mono text-lg sm:text-2xl">P2 V2</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2 2xl:grid-cols-[minmax(0,1fr)_280px_280px_minmax(0,1fr)]">
        <div className="rounded-xl border border-slate-300 bg-white p-3">
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-600 sm:text-xs">
            Pressure Gauge P1
          </p>
          <PressureGauge
            pressure={p1Pressure}
            ratio={p1Ratio}
            compact
            tone="light"
          />
        </div>

        <div className="rounded-xl border border-slate-300 bg-white p-3">
          <p className="mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-slate-600 sm:text-xs">
            Compressor - Left Side
          </p>
          <Compressor
            onCompress={actions.compressGas}
            onRelease={actions.expandGas}
            disabled={!state.powerOn}
            embedded
            tone="light"
          />
        </div>

        <div className="rounded-xl border border-slate-300 bg-white p-3">
          <p className="mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-slate-600 sm:text-xs">
            Compressor - Right Side
          </p>
          <Compressor
            onCompress={actions.expandGas}
            onRelease={actions.compressGas}
            disabled={!state.powerOn}
            embedded
            tone="light"
          />
        </div>

        <div className="rounded-xl border border-slate-300 bg-white p-3">
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-600 sm:text-xs">
            Pressure Gauge P2
          </p>
          <PressureGauge
            pressure={p2Pressure}
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
  const { p1: inletPressure, p2: outletPressure } = getCoupledPressures(
    state.pressure,
    config.limits.pressure,
    config.initialState.pressure,
  );
  const pressureSpan = config.limits.pressure.max - config.limits.pressure.min;
  const pressureBias = clamp(
    (inletPressure - outletPressure) / pressureSpan,
    -1,
    1,
  );
  const thermalShift = pressureBias * 22;
  const leftTemp = clamp(
    state.temperature + thermalShift,
    config.limits.temperature.min,
    config.limits.temperature.max,
  );
  const rightTemp = clamp(
    state.temperature - thermalShift,
    config.limits.temperature.min,
    config.limits.temperature.max,
  );

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
                {leftTemp.toFixed(1)} C / {rightTemp.toFixed(1)} C
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-slate-900/75 px-3 py-2">
              <span>Pressure Ratio</span>
              <span className="font-mono">
                {(inletPressure / outletPressure).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-slate-900/75 px-3 py-2">
              <span>Volume State</span>
              <span className="font-mono">{state.volume.toFixed(2)} L</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LabScene;
