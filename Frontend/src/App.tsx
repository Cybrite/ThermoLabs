import { useAuth0, User } from "@auth0/auth0-react";
import {
  PROFESSOR_ROLE_NAME,
  STUDENT_ROLE_NAME,
  getRoleValues,
  hasProfessorRole,
  hasStudentRole,
  roleIdFor,
  type RoleName,
} from "./auth/roles";
import {
  getStoredPreferredRole,
  setStoredPreferredRole,
} from "./auth/preferredRole";
import { AuthLanding } from "./features/auth/components/AuthLanding";
import { ControlPanel } from "./features/lab/components/ControlPanel";
import { LabHeader } from "./features/lab/components/LabHeader";
import { MonitorPanel } from "./features/lab/components/MonitorPanel";
import { useBackendStatus } from "./features/lab/hooks/useBackendStatus";
import { useSimulation } from "./features/lab/hooks/useSimulation";

function App() {
  const { isLoading, isAuthenticated, error, loginWithRedirect, logout, user } =
    useAuth0<User>();

  const roleValues = getRoleValues(user);
  const userHasProfessorRole = hasProfessorRole(roleValues);
  const userHasStudentRole = hasStudentRole(roleValues);
  const hasKnownRole = userHasProfessorRole || userHasStudentRole;

  const preferredRole = getStoredPreferredRole();
  const showProfessorRole =
    userHasProfessorRole ||
    (!hasKnownRole && preferredRole === PROFESSOR_ROLE_NAME);
  const showStudentRole =
    userHasStudentRole ||
    (!hasKnownRole && preferredRole === STUDENT_ROLE_NAME);

  const roleName = showProfessorRole
    ? "Professor"
    : showStudentRole
      ? "Student"
      : "Observer";

  const { backendStatus, backendMessage } = useBackendStatus();
  const {
    simulationConfig,
    isRunning,
    setIsRunning,
    history,
    latestPoint,
    temperatureSeries,
    pressureSeries,
    timelinePercent,
    thermalPercent,
    inletPressurePercent,
    outletPressurePercent,
    updateConfig,
    resetSimulation,
    runSingleStep,
    applyScenario,
    quickScenarios,
  } = useSimulation();

  const startAuth = (role: RoleName, signupMode: boolean) => {
    setStoredPreferredRole(role);
    const roleId = roleIdFor(role);

    const authorizationParams = {
      ...(signupMode ? { screen_hint: "signup" } : {}),
      selected_role: role,
      selected_role_id: roleId,
    };

    loginWithRedirect({
      appState: { selectedRole: role },
      authorizationParams,
    });
  };

  const handleLogout = () =>
    logout({
      logoutParams: { returnTo: window.location.origin },
    });

  if (isLoading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    return (
      <AuthLanding errorMessage={error?.message} onStartAuth={startAuth} />
    );
  }

  return (
    <main className="lab-shell">
      <LabHeader
        userEmail={user?.email}
        roleName={roleName}
        backendStatus={backendStatus}
        backendMessage={backendMessage}
        hasKnownRole={hasKnownRole}
        preferredRole={preferredRole}
        onLogout={handleLogout}
      />

      <section className="layout-grid">
        <ControlPanel
          simulationConfig={simulationConfig}
          isRunning={isRunning}
          showProfessorRole={showProfessorRole}
          quickScenarios={quickScenarios}
          onUpdateConfig={updateConfig}
          onToggleRun={() => setIsRunning((running) => !running)}
          onRunSingleStep={runSingleStep}
          onResetSimulation={() => resetSimulation()}
          onApplyScenario={applyScenario}
        />

        <MonitorPanel
          latestPoint={latestPoint}
          timelinePercent={timelinePercent}
          thermalPercent={thermalPercent}
          inletPressurePercent={inletPressurePercent}
          outletPressurePercent={outletPressurePercent}
          temperatureSeries={temperatureSeries}
          pressureSeries={pressureSeries}
          history={history}
        />
      </section>
    </main>
  );
}

export default App;
