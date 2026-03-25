import Compressor from "./Compressor";
import PistonArrangement from "./PistonArrangement";
import PressureGauge from "./PressureGauge";
import Thermometer from "./Thermometer";

const FlowHint = () => (
  <svg viewBox="0 0 300 40" className="h-10 w-full">
    <defs>
      <marker
        id="flowArrow"
        markerWidth="8"
        markerHeight="8"
        refX="7"
        refY="4"
        orient="auto"
      >
        <polygon points="0 0, 8 4, 0 8" className="fill-cyan-300" />
      </marker>
    </defs>
    <line
      x1="18"
      y1="20"
      x2="282"
      y2="20"
      className="stroke-cyan-300/80"
      strokeWidth="3"
      markerEnd="url(#flowArrow)"
    />
    <text
      x="150"
      y="14"
      textAnchor="middle"
      className="fill-cyan-100 text-[10px] tracking-[0.18em] uppercase"
    >
      Gas Flow Direction
    </text>
  </svg>
);

const LabScene = ({ state, derived, config, actions }) => {
  return (
    <section className="min-w-0 space-y-4">
      <div className="rounded-2xl border border-cyan-300/25 bg-slate-900/40 p-3">
        <FlowHint />
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <Compressor
          onCompress={actions.compressGas}
          onRelease={actions.expandGas}
          disabled={!state.powerOn}
        />
        <PressureGauge
          pressure={state.pressure}
          ratio={derived.pressureRatio}
        />
        <PistonArrangement
          volume={state.volume}
          ratio={derived.volumeRatio}
          min={config.limits.volume.min}
          max={config.limits.volume.max}
          onVolumeChange={actions.setVolume}
        />
        <Thermometer
          temperature={state.temperature}
          ratio={derived.temperatureRatio}
        />
      </div>
    </section>
  );
};

export default LabScene;
