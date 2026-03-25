import LabScene from "./components/LabScene";
import ControllerPanel from "./components/ControllerPanel";
import SwitchPanel from "./components/SwitchPanel";
import { LabProvider } from "./context/LabContext";
import { useLab } from "./hooks/useLab";

const LabWorkspace = () => {
  const { state, config, derived, actions } = useLab();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1f2937,#111827_46%,#090d14)] text-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-2xl border border-slate-500/40 bg-slate-900/80 p-6 shadow-[0_20px_45px_rgba(2,6,23,0.55)]">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/85">
            Virtual Thermodynamics Lab
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Joule-Thomson Experiment Simulator
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300/95 sm:text-base">
            Interact with compressor, piston, and controls to observe how
            pressure-volume changes influence temperature in a simplified
            Joule-Thomson process.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_340px]">
          <LabScene
            state={state}
            derived={derived}
            config={config}
            actions={actions}
          />
          <div className="min-w-0 space-y-4">
            <SwitchPanel
              onCompress={actions.compressGas}
              onExpand={actions.expandGas}
              onReset={actions.resetSystem}
              onTogglePower={actions.togglePower}
              powerOn={state.powerOn}
            />
            <ControllerPanel
              state={state}
              config={config}
              onIntensityChange={actions.setIntensity}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

function App() {
  return (
    <LabProvider>
      <LabWorkspace />
    </LabProvider>
  );
}

export default App;
