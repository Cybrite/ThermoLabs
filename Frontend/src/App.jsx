import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LabScene from "./components/LabScene";
import ControllerPanel from "./components/ControllerPanel";
import SwitchPanel from "./components/SwitchPanel";
import AuthGate from "./components/AuthGate";
import AuthPage from "./components/AuthPage";
import RoleDashboard from "./components/RoleDashboard";
import { AuthProvider } from "./context/AuthContext";
import { LabProvider } from "./context/LabContext";
import { useAuth } from "./hooks/useAuth";
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
            Joule-Thomson process. Data streams live from the backend simulation.
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
              onStartSimulation={actions.startSimulation}
              onStopSimulation={actions.stopSimulation}
              onReset={actions.resetSystem}
              connected={state.connected}
              isRunning={state.isRunning}
              P1={state.p1Pa}
              P2={state.p2Pa}
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

const PublicEntry = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-100">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
          Loading session...
        </p>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace state={{ role: user?.role }} />;
  }

  return <AuthPage />;
};

const StudentLabPage = () => (
  <LabProvider>
    <LabWorkspace />
  </LabProvider>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicEntry />} />
          <Route
            path="/dashboard"
            element={
              <AuthGate>
                <RoleDashboard />
              </AuthGate>
            }
          />
          <Route
            path="/lab/joule-thomson"
            element={
              <AuthGate allowedRoles={["student"]}>
                <StudentLabPage />
              </AuthGate>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
