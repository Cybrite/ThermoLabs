import Compressor from "./Compressor";
import PistonArrangement from "./PistonArrangement";
import PressureGauge from "./PressureGauge";
import Thermometer from "./Thermometer";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const ExperimentSetup = ({ state, derived, actions }) => {
  const leftTemp = Math.max(state.temperature + 2.6, -40);
  const rightTemp = Math.max(state.temperature - 1.8, -40);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-500/45 bg-[linear-gradient(145deg,rgba(2,18,42,0.96),rgba(10,27,59,0.92))] p-4 shadow-[0_22px_48px_rgba(2,8,25,0.55)] sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200 sm:text-base">
          Experiment Setup
        </h2>
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300 sm:text-xs">
          Component-Oriented Layout
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-500/35 bg-slate-950/45 p-4 sm:p-6">
        <div className="h-3 rounded-md bg-slate-500/70" />

        <div className="mt-3 grid grid-cols-3 items-start gap-2 sm:gap-4">
          <div className="flex justify-center">
            <Thermometer
              temperature={leftTemp}
              ratio={clamp(derived.temperatureRatio + 0.06, 0, 1)}
              embedded
            />
          </div>
          <p className="pt-1 text-center text-[10px] uppercase tracking-[0.24em] text-slate-300 sm:text-xs">
            Throttle Chamber
          </p>
          <div className="flex justify-center">
            <Thermometer
              temperature={rightTemp}
              ratio={clamp(derived.temperatureRatio - 0.04, 0, 1)}
              embedded
            />
          </div>
        </div>

        <div className="relative mt-3 sm:mt-4">
          <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 border-l-[3px] border-dashed border-slate-400/70" />
          <div className="h-3 rounded-md bg-slate-500/70" />

          <div className="relative mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-6">
            <div className="flex flex-col items-center gap-1">
              <PistonArrangement
                volume={state.volume}
                ratio={derived.volumeRatio}
                min={0.4}
                max={3.2}
                onVolumeChange={() => {}}
                embedded
              />
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200 sm:text-xs">
                High Side
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <PistonArrangement
                volume={state.volume}
                ratio={derived.volumeRatio}
                min={0.4}
                max={3.2}
                onVolumeChange={() => {}}
                embedded
                mirrored
              />
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200 sm:text-xs">
                Low Side
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_320px_minmax(0,1fr)]">
        <div className="rounded-xl border border-slate-500/45 bg-slate-900/65 p-3">
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-300 sm:text-xs">
            Inlet Pressure (P1V1)
          </p>
          <PressureGauge
            pressure={state.pressure}
            ratio={derived.pressureRatio}
            compact
          />
        </div>
        <div className="rounded-xl border border-slate-500/45 bg-slate-900/65 p-3 md:col-span-2 xl:col-span-1">
          <p className="mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-slate-300 sm:text-xs">
            Compressor Control
          </p>
          <Compressor
            onCompress={actions.compressGas}
            onRelease={actions.expandGas}
            disabled={!state.powerOn}
            embedded
          />
        </div>
        <div className="rounded-xl border border-slate-500/45 bg-slate-900/65 p-3">
          <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-300 sm:text-xs">
            Outlet Pressure (P2V2)
          </p>
          <PressureGauge
            pressure={Math.max(state.pressure * 0.78, 0.2)}
            ratio={clamp(derived.pressureRatio - 0.14, 0, 1)}
            compact
          />
        </div>
      </div>
    </section>
  );
};

const LabScene = ({ state, derived, config, actions }) => {
  return (
    <section className="min-w-0 space-y-4">
      <ExperimentSetup state={state} derived={derived} actions={actions} />

      <div className="grid gap-4 lg:grid-cols-1">
        <PistonArrangement
          volume={state.volume}
          ratio={derived.volumeRatio}
          min={config.limits.volume.min}
          max={config.limits.volume.max}
          onVolumeChange={actions.setVolume}
        />
      </div>
    </section>
  );
};

export default LabScene;
